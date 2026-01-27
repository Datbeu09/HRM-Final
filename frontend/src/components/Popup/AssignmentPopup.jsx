import React, { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../../api/employees.api";
import ClosePopup from "./ClosePopup";
import { addWorkAssignment } from "../../api/workAssignments.api";

const AssignmentPopup = ({ isOpen, closeModal, onCreated }) => {
  const [taskName, setTaskName] = useState("");
  const [department, setDepartment] = useState(""); // string để lọc nhân viên
  const [employeeId, setEmployeeId] = useState("");

  const [assignedDate, setAssignedDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");

  // bắt buộc theo DB
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");

  const [allEmployees, setAllEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeesInDept, setEmployeesInDept] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      const list = Array.isArray(data) ? data : [];
      setAllEmployees(list);

      const deptSet = new Set(list.map((emp) => emp.department).filter(Boolean));
      setDepartments([...deptSet]);
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (department) {
      const filtered = allEmployees.filter((emp) => emp.department === department);
      setEmployeesInDept(filtered);
      setEmployeeId("");
    } else {
      setEmployeesInDept([]);
      setEmployeeId("");
    }
  }, [department, allEmployees]);

  const selectedEmployee = useMemo(
    () => allEmployees.find((e) => String(e.id) === String(employeeId)) || null,
    [allEmployees, employeeId]
  );

  // reset form khi mở
  useEffect(() => {
    if (isOpen) {
      setTaskName("");
      setDepartment("");
      setEmployeeId("");
      setAssignedDate("");
      setDeadline("");
      setStatus("Pending");
      setNotes("");
      setDepartmentId("");
      setPositionId("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // lấy assignedByAccountId từ localStorage nếu có
    const assignedByAccountId = Number(localStorage.getItem("accountId") || 0);

    const payload = {
      employeeId: Number(employeeId),
      departmentId: Number(departmentId),
      positionId: Number(positionId),
      taskName,
      assignedDate, // YYYY-MM-DD ok
      deadline,
      status,
      notes,
      assignedByAccountId,
    };

    // validate đúng theo DB
    if (!payload.employeeId) return alert("Vui lòng chọn nhân viên");
    if (!payload.departmentId) return alert("Vui lòng nhập departmentId");
    if (!payload.positionId) return alert("Vui lòng nhập positionId");
    if (!payload.assignedByAccountId) return alert("Thiếu assignedByAccountId (cần lưu accountId sau login)");

    try {
      await addWorkAssignment(payload);
      closeModal();
      onCreated?.();
    } catch (error) {
      console.error("Lỗi khi thêm phân công công việc:", error);
      alert("Thêm phân công thất bại. Kiểm tra payload / backend validate.");
    }
  };

  if (!isOpen) return null;

  return (
    <ClosePopup onClose={closeModal}>
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Phân công công việc</h2>
              <p className="text-xs text-gray-500">Thiết lập trách nhiệm và thời hạn</p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {/* Task name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                Tên nhiệm vụ
              </label>
              <input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                placeholder="VD: Prepare payroll for Jan"
                required
              />
            </div>

            {/* Department (string để lọc nhân viên) */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                Phòng ban
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                required
              >
                <option value="">Chọn phòng ban</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Employee */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                Nhân viên
              </label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:bg-gray-100"
                disabled={!department}
                required
              >
                <option value="">
                  {department ? "Chọn nhân viên" : "Chọn phòng ban trước"}
                </option>
                {employeesInDept.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeCode} - {emp.name || emp.name}
                  </option>
                ))}
              </select>
              {selectedEmployee && (
                <p className="text-xs text-gray-500 mt-1">
                  Đã chọn: <b>{selectedEmployee.employeeCode}</b> - {selectedEmployee.name || selectedEmployee.name}
                </p>
              )}
            </div>

            {/* REQUIRED IDs for DB */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                  departmentId (DB)
                </label>
                <input
                  type="number"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                  placeholder="VD: 2"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                  positionId (DB)
                </label>
                <input
                  type="number"
                  value={positionId}
                  onChange={(e) => setPositionId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                  placeholder="VD: 2"
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                  Ngày giao
                </label>
                <input
                  type="date"
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
              >
                <option value="Pending">Pending</option>
                <option value="InProgress">InProgress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                Ghi chú
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                rows={3}
                placeholder="VD: Need draft by 20th"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 text-xs font-semibold text-white bg-[#009688] hover:bg-[#00796b] rounded-lg shadow-md"
            >
              Phân công
            </button>
          </div>
        </form>
      </div>
    </ClosePopup>
  );
};

export default AssignmentPopup;
