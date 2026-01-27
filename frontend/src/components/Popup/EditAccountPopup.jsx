import React, { useEffect, useState } from "react";
import { ROLES } from "../../auth/roles";

export default function EditAccountPopup({
  open,
  user,
  onClose,
  onSave,
}) {
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          Chỉnh sửa tài khoản
        </h2>

        {/* Username */}
        <div>
          <label className="text-sm text-gray-600">
            Tên đăng nhập
          </label>
          <input
            className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
            value={form.username}
            disabled
          />
        </div>

        {/* Mã nhân viên (nếu có) */}
        {isEmployeeUser && (
          <div>
            <label className="text-sm text-gray-600">
              Mã nhân viên
            </label>
            <input
              className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
              value={user.employeeCode}
              disabled
            />
          </div>
        )}

        {/* Role */}
        <div>
          <label className="text-sm text-gray-600">
            Vai trò
          </label>
          <select
            className="w-full mt-1 border rounded px-3 py-2"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
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
            <label className="text-sm text-gray-600">
              Trạng thái làm việc
            </label>
            <select
              className="w-full mt-1 border rounded px-3 py-2"
              value={form.workStatus}
              onChange={(e) =>
                setForm({ ...form, workStatus: e.target.value })
              }
            >
              <option value="Đang làm việc">Đang làm việc</option>
              <option value="Nghỉ việc">Nghỉ việc</option>
            </select>
          </div>
        )}

        {/* ACTION */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 rounded bg-primary text-white"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
