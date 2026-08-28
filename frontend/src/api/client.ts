const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    onUnauthorized?.();
    throw new ApiError(401, "未登入或登入已過期");
  }

  if (!res.ok) {
    let message = `請求失敗 (${res.status})`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiGet = <T,>(path: string) => apiFetch<T>(path, { method: "GET" });
export const apiPost = <T,>(path: string, body?: unknown) =>
  apiFetch<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
export const apiPatch = <T,>(path: string, body?: unknown) =>
  apiFetch<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
