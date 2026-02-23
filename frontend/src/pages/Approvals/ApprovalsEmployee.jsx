// src/pages/Approvals/ApprovalsEmployee.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { getEmployeeById } from "../../api/employees.api";
import {
  getApprovalsByEmployeeId,
  createApproval,
  approvalStatusLabelVI,
} from "../../api/approvals.api";

import EmployeeInfo from "../../components/ApprovalsEmployee/EmployeeInfo";
import AddRequestForm from "../../components/ApprovalsEmployee/AddRequestForm";
import RequestCard from "../../components/ApprovalsEmployee/RequestCard";

const normalizeApproval = (a = {}) => ({
  id: a.id,
  employeeId: a.employeeId,
  type: a.type,
  reason: a.reason,
  startDate: a.startDate,
  endDate: a.endDate,
  status: a.status,
  createdAt: a.createdAt ?? a.created_at ?? null,
  history: Array.isArray(a.history) ? a.history : [],
  created_at: a.created_at,
  updated_at: a.updated_at,
});

// ✅ sort MỚI -> CŨ (mới lên đầu)
const sortNewToOld = (arr = []) => {
  const copy = [...arr];
  copy.sort((a, b) => {
    const ta = new Date(a.createdAt || a.created_at || 0).getTime();
    const tb = new Date(b.createdAt || b.created_at || 0).getTime();
    return tb - ta;
  });
  return copy;
};

export default function ApprovalsEmployee() {
  const { user: currentUser } = useContext(AuthContext);

  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newRequest, setNewRequest] = useState({
    type: "",
    reason: "",
    startDate: "",
    endDate: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  // ✅ ref để cuộn lên đầu list
  const topRef = useRef(null);

  // lấy employeeId
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.employeeId) {
      setEmployeeId(currentUser.employeeId);
      return;
    }

    (async () => {
      try {
        const emp = await getEmployeeById(currentUser.id);
        setEmployee(emp || null);
        setEmployeeId(emp?.id ?? null);
      } catch (err) {
        console.error("Không lấy được thông tin nhân viên:", err);
        setEmployee(null);
        setEmployeeId(null);
      }
    })();
  }, [currentUser]);

  // lấy employee detail nếu cần
  useEffect(() => {
    if (!employeeId) return;
    if (employee) return;

    (async () => {
      try {
        const emp = await getEmployeeById(employeeId);
        setEmployee(emp || null);
      } catch (err) {
        console.error("Lỗi khi tải thông tin nhân viên:", err);
      }
    })();
  }, [employeeId, employee]);

  // fetch approvals
  useEffect(() => {
    if (!employeeId) return;
    fetchApprovals(employeeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const fetchApprovals = async (eid) => {
    try {
      setLoading(true);
      const arr = await getApprovalsByEmployeeId(eid);
      const mapped = (Array.isArray(arr) ? arr : []).map(normalizeApproval);

      // ✅ MỚI LÊN ĐẦU
      setApprovals(sortNewToOld(mapped));
    } catch (err) {
      console.error("Lỗi khi tải approvals:", err);
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { type, startDate, endDate, reason } = newRequest;

    if (!type || !startDate || !endDate || !reason) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    const payload = { employeeId, type, reason, startDate, endDate };

    try {
      await createApproval(payload);

      setNewRequest({ type: "", reason: "", startDate: "", endDate: "" });
      setShowPopup(false);

      // reload list (đã sort mới lên đầu)
      await fetchApprovals(employeeId);

      // ✅ cuộn mượt lên trên để thấy item mới ngay
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err) {
      console.error("Lỗi khi tạo yêu cầu:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Tạo yêu cầu thất bại, vui lòng thử lại.");
    }
  };

  if (!currentUser || !employeeId) {
    return <div className="p-6 text-sm text-gray-500">Đang tải thông tin nhân viên...</div>;
  }

return (
  <aside className="h-screen flex flex-col w-full max-w-md lg:max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
    {/* Header */}
    <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Yêu cầu</h2>

      <button
        onClick={() => setShowPopup(true)}
        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition shadow-sm"
      >
        + Thêm mới
      </button>
    </div>

    {/* ✅ Chỉ phần này scroll */}
    <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm bg-slate-50 dark:bg-slate-950 hrm-scroll">
      <EmployeeInfo employee={employee} employeeId={employeeId} />

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : approvals.length === 0 ? (
        <div className="text-center text-gray-400 py-10">Chưa có yêu cầu nào</div>
      ) : (
        <div className="space-y-3">
          <div ref={topRef} />

          {approvals.map((item) => (
            <RequestCard
              key={item.id}
              request={item}
              statusLabel={approvalStatusLabelVI(item.status)}
            />
          ))}
        </div>
      )}
    </div>

    {/* Popup */}
    {showPopup && (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={() => setShowPopup(false)}
      >
        <div
          className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <AddRequestForm
            request={newRequest}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={() => setShowPopup(false)}
          />
        </div>
      </div>
    )}
  </aside>
);
}