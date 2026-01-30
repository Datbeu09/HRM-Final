import React, { useEffect, useMemo, useState } from "react";
import TaskStats from "../../components/Assignment/User/TaskStats";
import TaskList from "../../components/Assignment/User/TaskList";

import { getMyWorkAssignments, updateMyWorkAssignmentStatus } from "../../api/workAssignments.api";
import { getMyWorkAssignmentResponses, createMyWorkAssignmentResponse } from "../../api/workAssignmentResponses.api";

// map status hiển thị cho UI
const mapUiStatus = ({ waStatus, responseStatus }) => {
  const r = String(responseStatus || "").toUpperCase();
  const w = String(waStatus || "").toUpperCase();

  // Nếu nhân viên từ chối
  if (r === "REJECTED") return "rejected";

  // Nếu đã hoàn thành
  if (w === "DONE" || w === "COMPLETED") return "done";

  // Nếu đã tiếp nhận => đang làm
  if (r === "ACCEPTED" || w === "IN_PROGRESS" || w === "DOING") return "inprogress";

  // mặc định chờ tiếp nhận
  return "pending";
};

export default function AssignmentsUser() {
  const [assignments, setAssignments] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);

      // ✅ 1) công việc của nhân viên đang đăng nhập
      const wa = await getMyWorkAssignments();
      setAssignments(Array.isArray(wa) ? wa : []);

      // ✅ 2) phản hồi của chính nhân viên (accept/reject)
      const rs = await getMyWorkAssignmentResponses();
      setResponses(Array.isArray(rs) ? rs : []);
    } catch (err) {
      console.error("Lỗi khi tải công việc:", err);
      setAssignments([]);
      setResponses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // quick map response theo workAssignmentId
  const responseByAssignmentId = useMemo(() => {
    const mp = new Map();
    for (const r of responses) {
      mp.set(Number(r.workAssignmentId), r);
    }
    return mp;
  }, [responses]);

  // normalize để reuse lại TaskList UI
  const items = useMemo(() => {
    return assignments.map((w) => {
      const rid = Number(w.id);
      const resp = responseByAssignmentId.get(rid);

      return {
        id: w.id,
        title: w.taskName || w.taskNameFromTask || "N/A",
        description: w.notes || "",
        departmentName: w.departmentName || "",
        startDate: w.assignedDate || null,
        endDate: w.deadline || null,

        waStatus: w.status || "PENDING",
        responseStatus: resp?.status || "PENDING",

        uiStatus: mapUiStatus({ waStatus: w.status, responseStatus: resp?.status }),
        rejectReason: resp?.rejectReason || null,
      };
    });
  }, [assignments, responseByAssignmentId]);

  // ===== actions =====
  const onReceive = async (workAssignmentId) => {
    const id = Number(workAssignmentId);
    if (!id) return;

    try {
      // ✅ “tiếp nhận” = tạo response ACCEPTED (employeeId lấy từ token)
      await createMyWorkAssignmentResponse({ workAssignmentId: id, status: "ACCEPTED" });

      // optional: cập nhật status assignment sang IN_PROGRESS để quản trị dễ theo dõi
      await updateMyWorkAssignmentStatus(id, { status: "IN_PROGRESS" });

      await fetchAll();
    } catch (err) {
      console.error("Tiếp nhận thất bại:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Tiếp nhận thất bại");
    }
  };

  const onReject = async (workAssignmentId) => {
    const id = Number(workAssignmentId);
    if (!id) return;

    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    try {
      await createMyWorkAssignmentResponse({ workAssignmentId: id, status: "REJECTED", rejectReason: reason });
      await fetchAll();
    } catch (err) {
      console.error("Từ chối thất bại:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Từ chối thất bại");
    }
  };

  const onDone = async (workAssignmentId) => {
    const id = Number(workAssignmentId);
    if (!id) return;

    try {
      // ✅ “hoàn thành” = update status assignment DONE (backend kiểm tra đúng employee)
      await updateMyWorkAssignmentStatus(id, { status: "DONE" });
      await fetchAll();
    } catch (err) {
      console.error("Hoàn thành thất bại:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Hoàn thành thất bại");
    }
  };

  // ===== Stats (dựa trên uiStatus) =====
  const stats = useMemo(() => {
    let pending = 0, inProgress = 0, done = 0;

    for (const t of items) {
      if (t.uiStatus === "pending") pending++;
      else if (t.uiStatus === "inprogress") inProgress++;
      else if (t.uiStatus === "done") done++;
    }
    return { pending, inProgress, done };
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Đang tải danh sách công việc...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen overflow-hidden font-sans">
      <div className="flex h-full overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            <div className="max-w-7xl mx-auto space-y-6">
              <TaskStats stats={stats} />

              <TaskList
                tasks={items}
                getStatus={(id) => items.find((x) => Number(x.id) === Number(id))?.uiStatus || "pending"}
                onReceive={onReceive}
                onDone={onDone}
                onReject={onReject}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
