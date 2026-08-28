import { apiGet, apiPost } from "./client";
import type { AuthResponse, UserSummary } from "../types";

export const register = (email: string, password: string, displayName: string) =>
  apiPost<AuthResponse>("/auth/register", { email, password, displayName });

export const login = (email: string, password: string) =>
  apiPost<AuthResponse>("/auth/login", { email, password });

export const fetchMe = () => apiGet<UserSummary>("/auth/me");
