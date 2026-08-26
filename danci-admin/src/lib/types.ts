export type AdminRole = "super" | "admin";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
};
