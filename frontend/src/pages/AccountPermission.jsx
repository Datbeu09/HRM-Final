// AccountPermission.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getUserList, addUser, updateUser, deleteUser } from "../api/accounts.api";
import AccountPermissionFilter from "../components/AccountPermission/AccountPermissionFilter";
import AccountPermissionTable from "../components/AccountPermission/AccountPermissionTable";
import Pagination from "../components/common/Pagination";
import EditAccountPopup from "../components/Popup/EditAccountPopup";

const PAGE_SIZE = 5;
const safeStr = (v) => (v == null ? "" : String(v));

export default function AccountPermission() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editingUser, setEditingUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setErrMsg("");
      const arr = await getUserList(); // ✅ mảng
      setUsers(Array.isArray(arr) ? arr : []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUsers([]);
      setErrMsg("Không tải được danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => setPage(1), [roleFilter, statusFilter, search]);

  // ✅ roleOptions dynamic (đảm bảo có EMPLOYEE/DIRECTOR nếu backend trả)
  const roleOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => u?.role && set.add(u.role));
    return Array.from(set);
  }, [users]);

  const filteredUsers = useMemo(() => {
    const keyword = safeStr(search).trim().toLowerCase();

    return users.filter((user) => {
      const matchRole = roleFilter ? user?.role === roleFilter : true;
      const matchStatus = statusFilter ? user?.status === statusFilter : true;

      const u = safeStr(user?.username).toLowerCase();
      const ec = safeStr(user?.employeeCode).toLowerCase();
      const name = safeStr(user?.name).toLowerCase();

      const matchSearch = !keyword || u.includes(keyword) || ec.includes(keyword) || name.includes(keyword);
      return matchRole && matchStatus && matchSearch;
    });
  }, [users, roleFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pagedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setShowEdit(true);
  }, []);

  const closeEdit = useCallback(() => {
    setShowEdit(false);
    setEditingUser(null);
  }, []);

  const handleSave = useCallback(
    async (payload) => {
      try {
        const saved = payload?.id ? await updateUser(payload) : await addUser(payload);
        const finalUser = saved || payload;

        setUsers((prev) => {
          const idx = prev.findIndex((u) => u.id === finalUser.id);
          if (idx === -1) return [finalUser, ...prev];
          const next = [...prev];
          next[idx] = finalUser;
          return next;
        });

        closeEdit();
      } catch (error) {
        console.error("Error saving user:", error);
        alert("Lưu tài khoản thất bại. Vui lòng thử lại.");
      }
    },
    [closeEdit]
  );

  const handleDelete = useCallback(async (user) => {
    const ok = window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user?.username}" không?`);
    if (!ok) return;

    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Xóa tài khoản thất bại. Vui lòng thử lại.");
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-background font-display text-gray-900">
      <main className="flex-1 flex flex-col overflow-hidden">
        <AccountPermissionFilter
          search={search}
          onSearch={setSearch}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          setRoleFilter={setRoleFilter}
          setStatusFilter={setStatusFilter}
          roleOptions={roleOptions} // ✅ truyền vào filter
        />

        <div className="flex-1 overflow-auto px-4 md:px-8 py-6 space-y-4">
          {errMsg && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
              {errMsg}
            </div>
          )}

          <AccountPermissionTable users={loading ? [] : pagedUsers} onEdit={handleEdit} onDelete={handleDelete} />

          {!loading && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}

          {loading && <div className="text-sm text-slate-500 px-1">Đang tải danh sách tài khoản...</div>}
        </div>
      </main>

      <EditAccountPopup
        open={showEdit}
        user={editingUser}
        roleOptions={roleOptions}
        onClose={closeEdit}
        onSave={handleSave}
      />
    </div>
  );
}
