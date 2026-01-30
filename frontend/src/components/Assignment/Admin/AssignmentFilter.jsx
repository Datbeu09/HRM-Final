import React, { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../../../api/employees.api";

export default function AssignmentFilter({
  assignments = [],
  onFilter = () => {},
  openModal,
}) {
  const [employees, setEmployees] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState(""); // YYYY-MM-DD

  useEffect(() => {
    getEmployees().then((data) => setEmployees(Array.isArray(data) ? data : []));
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!departmentName) return [];
    // employees table có field "department" (text)
    return employees.filter((emp) => emp.department === departmentName);
  }, [departmentName, employees]);

  useEffect(() => {
    const filtered = assignments.filter((a) => {
      const matchDepartment =
        !departmentName || a.departmentName === departmentName;

      const matchEmployee =
        !employeeId || String(a.employeeId) === String(employeeId);

      const matchTask =
        !taskName ||
        String(a.taskName || "").toLowerCase().includes(taskName.toLowerCase());

      const matchDeadline = !deadline || a.deadlineText === deadline;

      return matchDepartment && matchEmployee && matchTask && matchDeadline;
    });

    onFilter(filtered);
  }, [departmentName, employeeId, taskName, deadline, assignments, onFilter]);

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          value={departmentName}
          onChange={(e) => {
            setDepartmentName(e.target.value);
            setEmployeeId("");
          }}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Tất cả phòng ban</option>
          {[...new Set(assignments.map((a) => a.departmentName))].map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          disabled={!departmentName}
          className="px-4 py-2 border rounded-lg disabled:bg-gray-100"
        >
          <option value="">
            {departmentName ? "Chọn nhân viên" : "Chọn phòng ban trước"}
          </option>

          {filteredEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.employeeCode} - {emp.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tên nhiệm vụ..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />

        <button
          onClick={openModal}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          + Tạo mới
        </button>
      </div>
    </div>
  );
}
