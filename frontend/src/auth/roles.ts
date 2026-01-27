export const ROLES = {
  ADMIN: "admin",
  GIAMDOC: "giamdoc",
  HR: "HR",
  KETOAN: "ketoan",
  NHANVIEN: "nhanvien",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
