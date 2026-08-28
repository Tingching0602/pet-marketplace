import { apiGet } from "./client";
import type { Profile } from "../types";

export const fetchProfile = () => apiGet<Profile>("/profile/me");
