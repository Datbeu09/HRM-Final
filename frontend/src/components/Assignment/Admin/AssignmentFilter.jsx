import React, { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../../../api/employees.api";
import { toYMD } from "../../../utils/dateOnly";

const normalizeText = (v) =>
  String(v || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export default function AssignmentFilter({
  assignments = [],
  onFilter = () => {},
  openModal,
}) {
  const [employees, setEmployees] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState(""); // YYYY-MM-DD from input

  useEffect(() => {
    (async () => {
      try {
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("[AssignmentFilter] getEmployees error:", e);
        setEmployees([]);
      }
    })();
  }, []);

  const departmentOptions = useMemo(() => {
    const set = new Set();
    for (const a of assignments) {
      if (a?.departmentName) set.add(a.departmentName);
    }
    return Array.from(set);
  }, [assignments]);

  const deptNameToId = useMemo(() => {
    const map = new Map();
    for (const a of assignments) {
      const name = a?.departmentName;
      const id = a?.departmentId;
      if (name && id != null) map.set(normalizeText(name), Number(id));
    }
    return map;
  }, [assignments]);

  const filteredEmployees = useMemo(() => {
    if (!departmentName) return [];

    const targetDeptNameNorm = normalizeText(departmentName);
    const targetDeptId = deptNameToId.get(targetDeptNameNorm);

    return employees.filter((emp) => {
      if (emp?.departmentId != null && targetDeptId != null) {
        return Number(emp.departmentId) === Number(targetDeptId);
      }
      const empDeptNorm = normalizeText(emp?.department);
      return empDeptNorm && empDeptNorm === targetDeptNameNorm;
    });
  }, [departmentName, employees, deptNameToId]);

  useEffect(() => {
    const filtered = assignments.filter((a) => {
      const matchDepartment =
        !departmentName ||
        normalizeText(a?.departmentName) === normalizeText(departmentName);

      const matchEmployee =
        !employeeId || String(a?.employeeId) === String(employeeId);

      const matchTask =
        !taskName ||
        normalizeText(a?.taskName).includes(normalizeText(taskName));

      // ✅ Normalize deadline compare: luôn compare theo YYYY-MM-DD
      const aDeadline = toYMD(a?.deadlineText || a?.deadline);
      const matchDeadline = !deadline || aDeadline === deadline;

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
          {departmentOptions.map((dep) => (
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
          onChange={(e) => setDeadline(e.target.value)} // ✅ input date cho ra YYYY-MM-DD
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