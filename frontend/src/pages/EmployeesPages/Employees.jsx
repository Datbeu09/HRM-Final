import React, { useCallback, useEffect, useMemo, useState } from "react";
import FilterBar from "../../components/Employees/FilterBar";
import EmployeeTable from "../../components/Employees/EmployeeTable";
import Pagination from "../../components/common/Pagination";
import { getEmployees } from "../../api/employees.api";
import EmployeesPopup from "../../components/Popup/Employees/EmployeesPopup";

const ITEMS_PER_PAGE = 5;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await getEmployees();
      const list = Array.isArray(data) ? data : [];
      setEmployees(list);
      setFilteredEmployees(list);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      setErrorMessage("Đã xảy ra lỗi khi tải danh sách nhân viên, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
    return Math.max(1, pages);
  }, [filteredEmployees.length]);

  const currentEmployees = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEmployees, currentPage]);

  const handleSearch = (searchParams) => {
    const keyword = (searchParams?.name || "").trim().toLowerCase();
    const code = (searchParams?.employeeCode || "").trim().toLowerCase();

    const dept = searchParams?.department || "Tất cả phòng ban";
    const position = searchParams?.position || "Tất cả vị trí";
    const contractType = searchParams?.contractType || "Tất cả loại HĐ";
    const status = searchParams?.status || "Tất cả trạng thái";

    const filtered = employees.filter((emp) => {
      const empName = (emp?.name || "").toLowerCase();
      const empCode = (emp?.employeeCode || "").toLowerCase();

      const matchName = keyword ? empName.includes(keyword) : true;
      const matchCode = code ? empCode.includes(code) : true;

      const matchDept = dept === "Tất cả phòng ban" ? true : emp?.department === dept;
      const matchPos = position === "Tất cả vị trí" ? true : emp?.position === position;
      const matchContract = contractType === "Tất cả loại HĐ" ? true : emp?.contractType === contractType;
      const matchStatus = status === "Tất cả trạng thái" ? true : emp?.status === status;

      return matchName && matchCode && matchDept && matchPos && matchContract && matchStatus;
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilteredEmployees(employees);
    setCurrentPage(1);
  };

  const handleAddEmployee = () => setOpenModal(true);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
      <div className="bg-white shadow-sm rounded-xl p-4">
        <FilterBar onSearch={handleSearch} onReset={handleReset} />
      </div>

      <div className="bg-white shadow-sm rounded-xl">
        {loading ? (
          <div className="p-4 text-center">Đang tải danh sách nhân viên...</div>
        ) : errorMessage ? (
          <div className="p-4 text-center text-red-500">{errorMessage}</div>
        ) : (
          <EmployeeTable employees={currentEmployees} itemsPerPage={ITEMS_PER_PAGE} onAdd={handleAddEmployee} />
        )}
      </div>

      {openModal && (
        <EmployeesPopup
          employees={employees}
          onClose={() => setOpenModal(false)}
          onSaved={() => {
            setOpenModal(false);
            fetchEmployees();
          }}
        />
      )}

      <div className="flex justify-end">
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default Employees;
