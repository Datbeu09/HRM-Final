import React, { useEffect, useState } from "react";
import { ROLES } from "../../auth/roles";

export default function EditAccountPopup({ open, user, onClose, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        username: user.username,
        role: user.role,
        workStatus: user.workStatus || "", // chỉ employee mới có
      });
    }
  }, [user]);

  if (!open || !form) return null;

  const isEmployeeUser = !!user.employeeCode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-8">
      {/* overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={onClose} />

      {/* modal */}
      <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-center flex-1">Chỉnh sửa tài khoản</h2>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <div className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-100 text-gray-700"
              value={form.username}
              disabled
            />
          </div>

          {/* Mã nhân viên (nếu có) */}
          {isEmployeeUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên</label>
              <input
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-100 text-gray-700"
                value={user.employeeCode}
                disabled
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.HR}>Nhân sự</option>
              <option value={ROLES.KETOAN}>Kế toán</option>
              <option value={ROLES.NHANVIEN}>Nhân viên</option>
            </select>
          </div>

          {/* Work Status – chỉ employee */}
          {isEmployeeUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái làm việc
              </label>
              <select
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                value={form.workStatus}
                onChange={(e) => setForm({ ...form, workStatus: e.target.value })}
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Nghỉ việc">Nghỉ việc</option>
              </select>
            </div>
          )}

          {/* ACTION */}
          <div className="flex justify-end mt-2 space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={() => onSave(form)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
