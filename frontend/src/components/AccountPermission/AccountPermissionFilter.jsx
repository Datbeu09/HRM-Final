import React from "react";
import FilterButton from "./FilterButton";

const ROLES = ["ADMIN", "HR", "ACCOUNTANT", "EMPLOYEE", "DIRECTOR"];
const STATUSES = ["Hoạt động", "Ngoại tuyến"]; // status từ employee.workStatus

export default function AccountPermissionFilter({
  search,
  onSearch,
  roleFilter,
  statusFilter,
  setRoleFilter,
  setStatusFilter,
}) {
  return (
    <div className="px-8 py-4 flex flex-col sm:flex-row gap-4 justify-between bg-background border-b border-border">
      <div className="relative w-full max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-textMuted">
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border text-sm focus:ring-2 focus:ring-primary/30 outline-none"
          placeholder="Tìm tên đăng nhập hoặc mã NV..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <FilterButton
          label={`Vai trò: ${roleFilter || "Tất cả"}`}
          options={ROLES}
          value={roleFilter}
          onChange={setRoleFilter}
        />
        <FilterButton
          label={`Trạng thái: ${statusFilter || "Tất cả"}`}
          options={STATUSES}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>
    </div>
  );
}
