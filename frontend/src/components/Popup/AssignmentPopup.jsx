import React, { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../../api/employees.api";
import { createWorkAssignment } from "../../api/workAssignments.api";
import { getDepartments } from "../../api/departments.api";
import { getTasks } from "../../api/tasks.api";

// PRIORITIES giữ UI nếu bạn thích, nhưng KHÔNG gửi lên BE vì DB không có cột priority
const PRIORITIES = ["Thấp", "Trung bình", "Cao"];

const AssignmentPopup = ({ isOpen, closeModal, onCreated }) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [departmentId, setDepartmentId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [taskId, setTaskId] = useState("");

  const [taskName, setTaskName] = useState("");
  const [notes, setNotes] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Trung bình"); // UI only
  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    if (!isOpen) return;

    const run = async () => {
      try {
        const [emps, deps, ts] = await Promise.all([
          getEmployees(),
          getDepartments(),
          getTasks(),
        ]);
        setAllEmployees(Array.isArray(emps) ? emps : []);
        setDepartments(Array.isArray(deps) ? deps : []);
        setTasks(Array.isArray(ts) ? ts : []);
      } catch (e) {
        console.error("[AssignmentPopup] load data error:", e);
        setAllEmployees([]);
        setDepartments([]);
        setTasks([]);
      }
    };

    run();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setDepartmentId("");
    setEmployeeId("");
    setTaskId("");
    setTaskName("");
    setNotes("");
    setAssignedDate("");
    setDeadline("");
    setPriority("Trung bình");
    setStatus("PENDING");
  }, [isOpen]);

  const selectedDepartment = useMemo(
    () => departments.find((d) => String(d.id) === String(departmentId)) || null,
    [departments, departmentId]
  );

  // ✅ employees hiện tại lọc theo employees.department (text) khớp departmentName
  const employeesInDept = useMemo(() => {
    if (!selectedDepartment?.departmentName) return [];
    return allEmployees.filter((emp) => emp.department === selectedDepartment.departmentName);
  }, [allEmployees, selectedDepartment]);

  const selectedEmployee = useMemo(
    () => allEmployees.find((e) => String(e.id) === String(employeeId)) || null,
    [allEmployees, employeeId]
  );

  const selectedTask = useMemo(
    () => tasks.find((t) => String(t.id) === String(taskId)) || null,
    [tasks, taskId]
  );

  useEffect(() => {
    if (!taskId || !selectedTask) return;
    setTaskName((prev) => (prev ? prev : selectedTask.taskName || ""));
    setNotes((prev) => (prev ? prev : selectedTask.description || ""));
  }, [taskId, selectedTask]);

  useEffect(() => {
    setEmployeeId("");
  }, [departmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assignedByAccountId = Number(localStorage.getItem("accountId") || 0);

    const payload = {
      employeeId: Number(employeeId),
      departmentId: departmentId ? Number(departmentId) : null,
      taskId: taskId ? Number(taskId) : null,

      taskName: String(taskName || "").trim(),
      notes: notes ? String(notes) : null,

      assignedDate: assignedDate || null,
      deadline: deadline || null,

      status: status || "PENDING",
      assignedByAccountId: assignedByAccountId || null,
      // ❌ priority: DB không có cột => không gửi
    };

    if (!payload.departmentId) return alert("Vui lòng chọn phòng ban");
    if (!payload.employeeId) return alert("Vui lòng chọn nhân viên phụ trách");

    // ✅ backend cho phép taskId OR taskName
    if (!payload.taskId && !payload.taskName) return alert("Vui lòng chọn task hoặc nhập Tên nhiệm vụ");

    if (!payload.assignedDate) return alert("Vui lòng chọn Ngày bắt đầu");
    if (!payload.deadline) return alert("Vui lòng chọn Deadline");

    if (payload.assignedDate && payload.deadline && payload.deadline < payload.assignedDate) {
      return alert("Deadline không được nhỏ hơn Ngày bắt đầu");
    }

    try {
      await createWorkAssignment(payload);
      closeModal?.();
      onCreated?.();
    } catch (error) {
      console.error("Lỗi khi thêm phân công công việc:", error);
      alert("Thêm phân công thất bại. Kiểm tra payload / backend.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-8">
      <div className="absolute inset-0 bg-gray-500/60" onClick={closeModal} />

      <div className="relative w-full max-w-3xl p-8 bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-center flex-1">Tạo nhiệm vụ phân công</h2>

          <button
            type="button"
            onClick={closeModal}
            className="ml-4 text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                required
              >
                <option value="">-- Chọn --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.departmentName || d.departmentCode || `Dept ${d.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên phụ trách</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-gray-100"
                disabled={!departmentId}
                required
              >
                <option value="">{departmentId ? "Chọn NV" : "Chọn phòng ban trước"}</option>
                {employeesInDept.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeCode} - {emp.name}
                  </option>
                ))}
              </select>

              {selectedEmployee && (
                <p className="text-xs text-gray-500 mt-2">
                  Đã chọn: <b>{selectedEmployee.employeeCode}</b> - {selectedEmployee.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task có sẵn (tuỳ chọn)
              </label>
              <select
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="">-- Không chọn --</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.taskCode ? `${t.taskCode} - ` : ""}{t.taskName}
                  </option>
                ))}
              </select>

              {selectedTask && (
                <p className="text-xs text-gray-500 mt-2">
                  Mô tả task mẫu: {selectedTask.description || "(trống)"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhiệm vụ</label>
              <input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                placeholder="VD: Hoàn thiện báo cáo tuần"
              />
              <p className="text-xs text-gray-500 mt-1">
                * Có thể để trống nếu bạn đã chọn task có sẵn.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                rows={4}
                placeholder="Mô tả yêu cầu, tiêu chí hoàn thành..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">* UI hiển thị, chưa lưu vào DB.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div className="flex justify-end mt-2 space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Hủy
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Tạo nhiệm vụ
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentPopup;
