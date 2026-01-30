// components/AccountPermission/AccountPermissionTable.jsx
import React from "react";

export default function AccountPermissionTable({ users, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm min-h-[310px]">
      <table className="min-w-full text-sm h-full">
        <thead>
          <tr className="bg-gray-100 text-gray-700 h-12">
            <th className="px-4 text-left">Tên đăng nhập</th>
            <th className="px-4 text-left hidden md:table-cell">Tên nhân viên</th>
            <th className="px-4 text-left">Vai trò</th>
            <th className="px-4 text-left hidden lg:table-cell">Trạng thái</th>
            <th className="px-4 text-center w-32">Hoạt động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="h-[52px] border-t hover:bg-gray-50">
              <td className="px-4 font-medium">{user.username}</td>

              <td className="px-4 hidden md:table-cell">
                {user?.name || <span className="text-slate-400">—</span>}
              </td>

              <td className="px-4">{user.role}</td>

              <td
                className={`px-4 font-semibold hidden lg:table-cell ${
                  String(user.status).toLowerCase() === "hoạt động" || String(user.status).toLowerCase() === "active"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {user.status}
              </td>

              <td className="px-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {users.length < 5 &&
            Array.from({ length: 5 - users.length }).map((_, i) => (
              <tr key={i} className="h-[52px] border-t">
                <td colSpan={5} />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
