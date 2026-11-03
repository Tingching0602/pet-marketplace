import { useLocation, useNavigate, type Location } from "react-router-dom";

export interface LoginRedirectState {
  from?: Location;
}

// Sends the user to /login, remembering the current page so login can return here.
export function useLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => navigate("/login", { state: { from: location } satisfies LoginRedirectState });
}

// Where to go after a successful login/register: the remembered page, or home.
export function getRedirectTarget(state: unknown): string {
  const from = (state as LoginRedirectState | null)?.from;
  if (!from || from.pathname === "/login" || from.pathname === "/register") return "/";
  return `${from.pathname}${from.search}${from.hash}`;
}
