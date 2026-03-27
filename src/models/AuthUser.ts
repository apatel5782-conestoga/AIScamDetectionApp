export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
}
