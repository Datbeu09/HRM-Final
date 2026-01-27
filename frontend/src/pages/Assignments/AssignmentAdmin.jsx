import React, { useEffect, useMemo, useState } from "react";

import AssignmentPopup from "../../components/Popup/AssignmentPopup";
import { getAllWorkAssignments } from "../../api/workAssignments.api";
import { getEmployees } from "../../api/employees.api";
import AssignmentFilter from "../../components/Assignment/Admin/AssignmentFilter";
import AssignmentTable from "../../components/Assignment/Admin/AssignmentTable";

const AssignmentAdmin = () => {
  const [rawAssignments, setRawAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [assignmentsData, employeesData] = await Promise.all([
          getAllWorkAssignments(), // ✅ mảng
          getEmployees(),          // ✅ mảng
        ]);

        setRawAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        setEmployees(Array.isArray(employeesData) ? employeesData : []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phân công:", error);
        setRawAssignments([]);
        setEmployees([]);
      }
    };

    fetchAll();
  }, []);

  // map để UI dùng employeeName/employeeCode/department
  const assignments = useMemo(() => {
    const empMap = new Map(employees.map((e) => [String(e.id), e]));

    return rawAssignments.map((a) => {
      const emp = empMap.get(String(a.employeeId));
      const employeeName = emp?.name || emp?.name || `Employee ${a.employeeId}`;

      return {
        ...a, // giữ nguyên field DB
        employeeCode: emp?.employeeCode || `#${a.employeeId}`,
        employeeName,
        department: emp?.department || `Dept ${a.departmentId}`,
        assignedDateText: a.assignedDate ? new Date(a.assignedDate).toISOString().slice(0, 10) : "",
        deadlineText: a.deadline ? new Date(a.deadline).toISOString().slice(0, 10) : "",
      };
    });
  }, [rawAssignments, employees]);

  useEffect(() => {
    setFilteredAssignments(assignments);
  }, [assignments]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const reloadAssignments = async () => {
    const data = await getAllWorkAssignments();
    setRawAssignments(Array.isArray(data) ? data : []);
  };

  return (
    <div className="p-6">
      <AssignmentFilter
        assignments={assignments}
        onFilter={setFilteredAssignments}
        openModal={openModal}
      />

      <AssignmentTable assignments={filteredAssignments} />

      <AssignmentPopup
        isOpen={isModalOpen}
        closeModal={closeModal}
        onCreated={reloadAssignments}
      />
    </div>
  );
};

export default AssignmentAdmin;
