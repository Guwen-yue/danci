export type AdminRole = "super" | "admin";

/** 管理员账号状态：active 启用 / disabled 停用 */
export type AdminStatus = "active" | "disabled";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
  updatedAt: string;
};
