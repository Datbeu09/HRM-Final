// components/Popup/EditAccountPopup.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function EditAccountPopup({
  open,
  user,
  roleOptions = [],
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(null);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [changePassword, setChangePassword] = useState(false); // ✅ checkbox

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        username: user.username,
        role: user.role || "",
        status: user.status || "",
      });
      setPw({ currentPassword: "", newPassword: "" });
      setChangePassword(false); // ✅ reset mỗi lần mở popup
    } else {
      setForm(null);
      setPw({ currentPassword: "", newPassword: "" });
      setChangePassword(false);
    }
  }, [user]);

  const roles = useMemo(() => {
    const set = new Set(roleOptions.filter(Boolean));
    if (form?.role) set.add(form.role);
    return Array.from(set);
  }, [roleOptions, form?.role]);

  if (!open || !form) return null;

  const handleToggleChangePassword = () => {
    setChangePassword((v) => {
      const next = !v;
      if (!next) setPw({ currentPassword: "", newPassword: "" }); // ✅ tắt thì clear
      return next;
    });
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      // ✅ chỉ gửi đổi mật khẩu khi checkbox bật + có newPassword
      ...(changePassword && pw.newPassword
        ? { currentPassword: pw.currentPassword, newPassword: pw.newPassword }
        : {}),
    };
    onSave(payload);
  };

  const disableSave =
    changePassword &&
    (
      !pw.currentPassword?.trim() || // ✅ bật đổi mật khẩu thì bắt nhập current
      !pw.newPassword?.trim()        // ✅ và new
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-8">
      <div className="absolute inset-0 bg-gray-500/50" onClick={onClose} />

      <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-center flex-1">
            Chỉnh sửa tài khoản
          </h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-100 text-gray-700"
              value={form.username}
              disabled
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nhân viên
            </label>
            <input
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-100 text-gray-700"
              value={user?.name || ""}
              disabled
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <select
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Toggle đổi mật khẩu */}
          <div className="pt-2 border-t">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={changePassword}
                onChange={handleToggleChangePassword}
              />
              <span className="text-sm font-semibold text-gray-800">
                Đổi mật khẩu
              </span>
            </label>

            {/* ✅ chỉ hiện khi bật */}
            {changePassword && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    value={pw.currentPassword}
                    onChange={(e) =>
                      setPw((p) => ({ ...p, currentPassword: e.target.value }))
                    }
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    value={pw.newPassword}
                    onChange={(e) =>
                      setPw((p) => ({ ...p, newPassword: e.target.value }))
                    }
                    placeholder="Nhập mật khẩu mới"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Khi bật “Đổi mật khẩu”, bạn cần nhập đủ mật khẩu hiện tại và mật khẩu mới.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-2 space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={disableSave}
              className={`px-4 py-2 rounded-md text-white ${
                disableSave
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
