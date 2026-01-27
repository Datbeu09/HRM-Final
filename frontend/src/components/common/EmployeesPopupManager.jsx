import React, { useCallback, useEffect, useMemo, useState } from "react";
import FilterBar from "../../components/Employees/FilterBar";
import EmployeeTable from "../../components/Employees/EmployeeTable";
import Pagination from "../../components/common/Pagination";
import { getEmployees } from "../../api/employees.api";
import EmployeesPopupManager from "../../components/common/EmployeesPopupManager";

const ITEMS_PER_PAGE = 5;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ===== FETCH =====
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
      setErrorMessage("Đã xảy ra lỗi khi tải danh sách nhân viên.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ===== PAGINATION =====
  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
    return Math.max(1, pages);
  }, [filteredEmployees.length]);

  const currentEmployees = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEmployees, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // ===== SEARCH =====
  const handleSearch = (searchParams) => {
    const keyword = (searchParams?.name || "").toLowerCase();
    const dept = searchParams?.department || "Tất cả phòng ban";
    const pos = searchParams?.title || "Tất cả chức danh";
    const status = searchParams?.status || "Nhân sự...";

    const filtered = employees.filter((emp) => {
      const matchName = keyword
        ? (emp.name || "").toLowerCase().includes(keyword)
        : true;

      const matchDept =
        dept === "Tất cả phòng ban" || emp.department === dept;

      const matchPos =
        pos === "Tất cả chức danh" || emp.position === pos;

      const matchStatus =
        status === "Nhân sự..." || emp.status === status;

      return matchName && matchDept && matchPos && matchStatus;
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilteredEmployees(employees);
    setCurrentPage(1);
  };

  return (
    <EmployeesPopupManager onSaved={fetchEmployees}>
      {({ handleAddEmployee }) => (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
          {/* FILTER */}
          <div className="bg-white shadow-sm rounded-xl p-4">
            <FilterBar onSearch={handleSearch} onReset={handleReset} />
          </div>

          {/* TABLE */}
          <div className="bg-white shadow-sm rounded-xl">
            {loading ? (
              <div className="p-4 text-center">
                Đang tải danh sách nhân viên...
              </div>
            ) : errorMessage ? (
              <div className="p-4 text-center text-red-500">
                {errorMessage}
              </div>
            ) : (
              <EmployeeTable
                employees={currentEmployees}
                onAdd={handleAddEmployee}      // ✅ Add
              />
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </EmployeesPopupManager>
  );
};

export default Employees;
