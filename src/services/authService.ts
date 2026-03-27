import type { AuthUser } from "../models/AuthUser";
import { apiRequest } from "./api";

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getMyProfile(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>("/users/me", {
    method: "GET",
    authToken: token,
  });
}

export async function updateMyProfile(
  token: string,
  payload: Partial<Pick<AuthUser, "name" | "email" | "phone" | "username">>,
): Promise<AuthUser> {
  return apiRequest<AuthUser>("/users/me", {
    method: "PATCH",
    authToken: token,
    body: JSON.stringify(payload),
  });
}
