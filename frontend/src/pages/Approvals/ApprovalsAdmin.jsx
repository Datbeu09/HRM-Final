// src/pages/Approvals/ApprovalsAdmin.jsx
import React, { useEffect, useMemo, useState } from "react";
import ApprovalsRequestCard from "../../components/Approvals/ApprovalsRequestCard";
import ApprovalsDetailPanel from "../../components/Approvals/ApprovalsDetailPanel";
import Pagination from "../../components/common/Pagination";
import ApprovalsFilterBar from "../../components/Approvals/ApprovalsFilterBar"; // ✅ NEW

import {
  getApprovals,
  approveApproval,
  rejectApproval,
  deleteApproval,
  APPROVAL_STATUS,
} from "../../api/approvals.api";

import { getEmployees, getEmployeeById } from "../../api/employees.api";

const normalizeApproval = (a = {}) => ({
  id: a.id,
  employeeId: a.employeeId,
  type: a.type,
  reason: a.reason,
  startDate: a.startDate,
  endDate: a.endDate,
  status: a.status, // Pending/Approved/Rejected OR VN
  createdAt: a.createdAt,
  history: Array.isArray(a.history) ? a.history : [],
  created_at: a.created_at,
  updated_at: a.updated_at,
});

// ✅ normalize status về EN để filter chắc chắn
const normalizeStatusEN = (s) => {
  if (!s) return "";
  if (s === "Chờ duyệt") return "Pending";
  if (s === "Đã duyệt") return "Approved";
  if (s === "Từ chối") return "Rejected";
  return s; // Pending/Approved/Rejected
};

export default function ApprovalsAdmin() {
  const [approvals, setApprovals] = useState([]);
  const [employeesMap, setEmployeesMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);

  // ✅ Filters
  const [filters, setFilters] = useState({
    q: "",
    type: "ALL",
    status: "ALL",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchAll();
  }, []);

  // ✅ khi filter đổi => quay về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.q, filters.type, filters.status]);

  const buildEmployeesMapFromList = (employees = []) => {
    const map = {};
    employees.forEach((emp) => {
      if (emp?.id != null) map[String(emp.id)] = emp;
    });
    return map;
  };

  const buildEmployeesMapByIdsFallback = async (employeeIds) => {
    const ids = [...new Set(employeeIds.filter(Boolean).map((x) => String(x)))];
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const emp = await getEmployeeById(id);
          return [String(id), emp];
        } catch {
          return [String(id), null];
        }
      })
    );
    return Object.fromEntries(results);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);

      const approvalsData = await getApprovals();
      const approvalsArr = Array.isArray(approvalsData)
        ? approvalsData.map(normalizeApproval)
        : [];
      setApprovals(approvalsArr);

      const approvalEmployeeIds = approvalsArr.map((a) => a.employeeId);

      try {
        const employees = await getEmployees();
        setEmployeesMap(buildEmployeesMapFromList(Array.isArray(employees) ? employees : []));
      } catch {
        const map = await buildEmployeesMapByIdsFallback(approvalEmployeeIds);
        setEmployeesMap(map);
      }
    } catch (error) {
      console.error("Lỗi khi tải approvals:", error);
      setApprovals([]);
      setEmployeesMap({});
    } finally {
      setLoading(false);
    }
  };

  const patchLocal = (id, next) => {
    setApprovals((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
    setSelectedRequest((prev) => (prev?.id === id ? { ...prev, ...next } : prev));
  };

  const handleApprove = async (id, note = "") => {
    try {
      const updated = await approveApproval(id, note ? { note } : {});
      patchLocal(id, normalizeApproval(updated));
    } catch (e) {
      console.error("Approve fail:", e);
      alert("Duyệt thất bại. Vui lòng thử lại.");
    }
  };

  const handleReject = async (id, note = "") => {
    try {
      const updated = await rejectApproval(id, note ? { note } : {});
      patchLocal(id, normalizeApproval(updated));
    } catch (e) {
      console.error("Reject fail:", e);
      alert("Từ chối thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Bạn chắc chắn muốn xoá yêu cầu này?");
    if (!ok) return;

    try {
      await deleteApproval(id);
      setApprovals((prev) => prev.filter((x) => x.id !== id));
      setSelectedRequest((prev) => (prev?.id === id ? null : prev));
    } catch (e) {
      console.error("Delete fail:", e);
      alert("Xoá thất bại. Vui lòng thử lại.");
    }
  };

  // ✅ FILTERED LIST
  const filteredApprovals = useMemo(() => {
    const q = (filters.q || "").trim().toLowerCase();
    const type = filters.type;
    const status = filters.status;

    return approvals.filter((a) => {
      const st = normalizeStatusEN(a.status);

      // type filter
      if (type !== "ALL" && (a.type || "") !== type) return false;

      // status filter
      if (status !== "ALL" && st !== status) return false;

      // search filter (reason + empName)
      if (q) {
        const emp = employeesMap[String(a.employeeId)];
        const empName = (emp?.name || "").toLowerCase();
        const reason = (a.reason || "").toLowerCase();
        if (!empName.includes(q) && !reason.includes(q)) return false;
      }

      return true;
    });
  }, [approvals, employeesMap, filters.q, filters.type, filters.status]);

  const totalPages = Math.max(1, Math.ceil(filteredApprovals.length / itemsPerPage));

  const currentApprovals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApprovals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApprovals, currentPage]);

  const selectedEmployee = selectedRequest
    ? employeesMap[String(selectedRequest.employeeId)]
    : null;

  return (
    <div className="h-screen w-full flex bg-gray-50 font-sans text-gray-900">
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-4">
            {/* ✅ FilterBar */}
            <ApprovalsFilterBar
              filters={filters}
              onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
              onReset={() => setFilters({ q: "", type: "ALL", status: "ALL" })}
            />

            {loading ? (
              <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : currentApprovals.length === 0 ? (
              <p className="text-center text-gray-500">Không có yêu cầu phù hợp</p>
            ) : (
              currentApprovals.map((request) => (
                <ApprovalsRequestCard
                  key={request.id}
                  request={request}
                  employee={employeesMap[String(request.employeeId)]}
                  onClick={() => setSelectedRequest(request)}
                  onApprove={(id) => handleApprove(id)}
                  onReject={(id, note) => handleReject(id, note)}
                  // ❌ không có xoá ở card theo yêu cầu của bạn => bỏ onDelete
                  canAction={normalizeStatusEN(request.status) === APPROVAL_STATUS.PENDING}
                />
              ))
            )}

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>

      <ApprovalsDetailPanel
        request={selectedRequest}
        employee={selectedEmployee}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete} // ✅ xoá chỉ ở detail
      />
    </div>
  );
}
