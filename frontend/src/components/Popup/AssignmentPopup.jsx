// src/components/Popup/AssignmentPopup.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../../api/employees.api";
import { createWorkAssignment } from "../../api/workAssignments.api";
import { getDepartments } from "../../api/departments.api";
import { getTasks } from "../../api/tasks.api";

const PRIORITIES = ["Thấp", "Trung bình", "Cao"];

// normalize text để match phòng ban theo tên (fallback)
const normalizeText = (v) =>
  String(v || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const toYMD = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val.includes("T") ? val.split("T")[0] : val;
  try {
    return new Date(val).toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

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

  const [submitting, setSubmitting] = useState(false);

  // ===== load data (employees, departments, tasks) =====
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

  // ===== reset form when open =====
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
    setSubmitting(false);
  }, [isOpen]);

  const selectedDepartment = useMemo(
    () => departments.find((d) => String(d.id) === String(departmentId)) || null,
    [departments, departmentId]
  );

  // ✅ FIX logic: lọc nhân viên theo phòng ban robust (departmentId nếu có, fallback theo text)
  const employeesInDept = useMemo(() => {
    if (!selectedDepartment) return [];
    const depId = selectedDepartment.id;
    const depNameNorm = normalizeText(selectedDepartment.departmentName);

    return allEmployees.filter((emp) => {
      // ưu tiên match theo employee.departmentId nếu tồn tại trong employee object
      if (emp?.departmentId != null) {
        return Number(emp.departmentId) === Number(depId);
      }
      // fallback match theo text employees.department
      const empDeptNorm = normalizeText(emp?.department);
      return empDeptNorm && empDeptNorm === depNameNorm;
    });
  }, [allEmployees, selectedDepartment]);

  const selectedEmployee = useMemo(
    () => allEmployees.find((e) => String(e.id) === String(employeeId)) || null,
    [allEmployees, employeeId]
  );

  const selectedTask = useMemo(
    () => tasks.find((t) => String(t.id) === String(taskId)) || null,
    [tasks, taskId]
  );

  // autofill taskName/notes khi chọn taskId (chỉ fill nếu đang trống)
  useEffect(() => {
    if (!taskId || !selectedTask) return;
    setTaskName((prev) => (prev ? prev : selectedTask.taskName || ""));
    setNotes((prev) => (prev ? prev : selectedTask.description || ""));
  }, [taskId, selectedTask]);

  // đổi phòng ban => reset employee
  useEffect(() => {
    setEmployeeId("");
  }, [departmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const payload = {
      employeeId: Number(employeeId),
      departmentId: departmentId ? Number(departmentId) : null,
      taskId: taskId ? Number(taskId) : null,

      // DB: taskName, notes
      taskName: String(taskName || "").trim(),
      notes: notes ? String(notes) : null,

      // DB: assignedDate, deadline
      assignedDate: assignedDate || null,
      deadline: deadline || null,

      // DB: status, assignedByAccountId
      status: status || "PENDING",

      // ✅ IMPORTANT: accountId không cần lưu trong localStorage (bạn đã có token),
      // backend controller của bạn đã lấy req.user?.id làm assignedByAccountId.
      // Nhưng nếu backend vẫn cho gửi, gửi null cũng ok.
      assignedByAccountId: null,
    };

    // validate UI
    if (!payload.departmentId) return alert("Vui lòng chọn phòng ban");
    if (!payload.employeeId) return alert("Vui lòng chọn nhân viên phụ trách");

    // backend cho phép taskId OR taskName
    if (!payload.taskId && !payload.taskName) {
      return alert("Vui lòng chọn task hoặc nhập Tên nhiệm vụ");
    }

    if (!payload.assignedDate) return alert("Vui lòng chọn Ngày bắt đầu");
    if (!payload.deadline) return alert("Vui lòng chọn Deadline");

    // so sánh yyyy-mm-dd ok
    if (payload.deadline < payload.assignedDate) {
      return alert("Deadline không được nhỏ hơn Ngày bắt đầu");
    }

    try {
      setSubmitting(true);
      await createWorkAssignment(payload);
      closeModal?.();
      onCreated?.();
    } catch (error) {
      console.error("Lỗi khi thêm phân công công việc:", error);
      alert(error?.response?.data?.message || "Thêm phân công thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-8">
      <div className="absolute inset-0 bg-gray-500/60" onClick={closeModal} />

      <div className="relative w-full max-w-3xl p-8 bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-center flex-1">
            Tạo nhiệm vụ phân công
          </h2>

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
            {/* Phòng ban */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban
              </label>
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

              {departments.length === 0 && (
                <p className="text-xs text-amber-600 mt-2">
                  Không có dữ liệu phòng ban. Kiểm tra API /departments trả về.
                </p>
              )}
            </div>

            {/* Nhân viên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhân viên phụ trách
              </label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-gray-100"
                disabled={!departmentId}
                required
              >
                <option value="">
                  {departmentId ? "Chọn NV" : "Chọn phòng ban trước"}
                </option>

                {employeesInDept.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeCode} - {emp.name}
                  </option>
                ))}
              </select>

              {departmentId && employeesInDept.length === 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  Phòng ban này chưa có nhân viên (hoặc dữ liệu employee.department không khớp).
                </p>
              )}

              {selectedEmployee && (
                <p className="text-xs text-gray-500 mt-2">
                  Đã chọn: <b>{selectedEmployee.employeeCode}</b> -{" "}
                  {selectedEmployee.name}
                </p>
              )}
            </div>

            {/* Task có sẵn */}
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
                    {t.taskCode ? `${t.taskCode} - ` : ""}
                    {t.taskName}
                  </option>
                ))}
              </select>

              {selectedTask && (
                <p className="text-xs text-gray-500 mt-2">
                  Mô tả task mẫu: {selectedTask.description || "(trống)"}
                </p>
              )}
            </div>

            {/* Tên nhiệm vụ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên nhiệm vụ
              </label>
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

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả chi tiết
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                rows={4}
                placeholder="Mô tả yêu cầu, tiêu chí hoàn thành..."
              />
            </div>

            {/* Ngày + ưu tiên */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={toYMD(assignedDate)}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={toYMD(deadline)}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ ưu tiên
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  * UI hiển thị, chưa lưu vào DB.
                </p>
              </div>
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
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

            {/* Actions */}
            <div className="flex justify-end mt-2 space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                disabled={submitting}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Đang tạo..." : "Tạo nhiệm vụ"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentPopup;
