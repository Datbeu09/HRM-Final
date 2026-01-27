import React, { useEffect, useMemo, useState } from "react";
import { getUserList, addUser, updateUser, deleteUser } from "../api/accounts.api";
import AccountPermissionFilter from "../components/AccountPermission/AccountPermissionFilter";
import AccountPermissionTable from "../components/AccountPermission/AccountPermissionTable";
import Pagination from "../components/common/Pagination";
import EditAccountPopup from "../components/Popup/EditAccountPopup";

const PAGE_SIZE = 5;

const toArray = (val) => {
  if (Array.isArray(val)) return val;
  // hỗ trợ nếu lỡ set nhầm object {data:[...]} hoặc {items:[...]}
  if (val && Array.isArray(val.data)) return val.data;
  if (val && Array.isArray(val.items)) return val.items;
  return [];
};

const safeStr = (v) => (v == null ? "" : String(v));

export default function AccountPermission() {
  const [users, setUsers] = useState([]); // luôn giữ mảng
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editingUser, setEditingUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // ================== FETCH DATA ==================
  useEffect(() => {
    let alive = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setErrMsg("");

        const data = await getUserList(); // API mới đã cố trả mảng
        if (!alive) return;

        const arr = toArray(data);
        setUsers(arr);
      } catch (error) {
        if (!alive) return;
        console.error("Error fetching user data:", error);
        setUsers([]);
        setErrMsg("Không tải được danh sách tài khoản.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      alive = false;
    };
  }, []);

  // Reset page khi thay đổi filter/search
  useEffect(() => {
    setPage(1);
  }, [roleFilter, statusFilter, search]);

  // ================== FILTER ==================
  const filteredUsers = useMemo(() => {
    const list = toArray(users);
    const keyword = safeStr(search).trim().toLowerCase();

    return list.filter((user) => {
      const matchRole = roleFilter ? user?.role === roleFilter : true;

      // bạn đang dùng user.status (đúng như bạn ghi)
      const matchStatus = statusFilter ? user?.status === statusFilter : true;

      const u = safeStr(user?.username).toLowerCase();
      const ec = safeStr(user?.employeeCode).toLowerCase();
      const name = safeStr(user?.name).toLowerCase();

      const matchSearch =
        !keyword || u.includes(keyword) || ec.includes(keyword) || name.includes(keyword);

      return matchRole && matchStatus && matchSearch;
    });
  }, [users, roleFilter, statusFilter, search]);

  // ================== PAGINATION ==================
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  // ================== ACTION HANDLERS ==================
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEdit(true);
  };

  const handleSave = async (payload) => {
    try {
      // API thường trả về bản ghi đã lưu (có id, updatedAt...)
      let saved;
      if (payload?.id) saved = await updateUser(payload);
      else saved = await addUser(payload);

      // fallback nếu API không trả data (hiếm)
      const finalUser = saved || payload;

      setUsers((prev) => {
        const arr = toArray(prev);
        const idx = arr.findIndex((u) => u.id === finalUser.id);

        // add mới
        if (idx === -1) return [finalUser, ...arr];

        // update
        const next = [...arr];
        next[idx] = finalUser;
        return next;
      });

      setShowEdit(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Lưu tài khoản thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (user) => {
    const ok = window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user?.username}" không?`);
    if (!ok) return;

    try {
      await deleteUser(user.id);
      setUsers((prev) => toArray(prev).filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Xóa tài khoản thất bại. Vui lòng thử lại.");
    }
  };

  // ================== RENDER ==================
  return (
    <div className="flex h-screen w-full bg-background font-display text-gray-900">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* FILTER */}
        <AccountPermissionFilter
          search={search}
          onSearch={setSearch}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          setRoleFilter={setRoleFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* CONTENT */}
        <div className="flex-1 overflow-auto px-4 md:px-8 py-6 space-y-4">
          {errMsg && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
              {errMsg}
            </div>
          )}

          <AccountPermissionTable
            users={loading ? [] : pagedUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {!loading && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}

          {loading && (
            <div className="text-sm text-slate-500 px-1">Đang tải danh sách tài khoản...</div>
          )}
        </div>
      </main>

      {/* EDIT MODAL */}
      <EditAccountPopup
        open={showEdit}
        user={editingUser}
        onClose={() => {
          setShowEdit(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
