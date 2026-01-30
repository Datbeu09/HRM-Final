import React, { useEffect, useMemo, useState } from "react";

import AssignmentPopup from "../../components/Popup/AssignmentPopup";
import { getAllWorkAssignments } from "../../api/workAssignments.api";
import AssignmentFilter from "../../components/Assignment/Admin/AssignmentFilter";
import AssignmentTable from "../../components/Assignment/Admin/AssignmentTable";

const AssignmentAdmin = () => {
  const [rawAssignments, setRawAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const assignmentsData = await getAllWorkAssignments();
        setRawAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phân công:", error);
        setRawAssignments([]);
      }
    };

    fetchAll();
  }, []);

  // chuẩn hoá text ngày cho UI (nếu backend trả Date)
  const assignments = useMemo(() => {
    return rawAssignments.map((a) => ({
      ...a,
      employeeCode: a.employeeCode || `#${a.employeeId}`,
      employeeName: a.employeeName || `Employee ${a.employeeId}`,
      departmentName:
        a.departmentName ||
        a.employeeDepartmentText ||
        (a.departmentId ? `Dept ${a.departmentId}` : "—"),

      assignedDateText: a.assignedDate
        ? new Date(a.assignedDate).toISOString().slice(0, 10)
        : "",
      deadlineText: a.deadline
        ? new Date(a.deadline).toISOString().slice(0, 10)
        : "",
    }));
  }, [rawAssignments]);

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
