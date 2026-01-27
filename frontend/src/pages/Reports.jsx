// pages/Reports.jsx
import React, { useEffect, useState } from "react";
import ReportsDataTable from "../components/Reports/ReportsDataTable";
import ReportsStatCard from "../components/Reports/ReportsStatCard";
import Pagination from "../components/common/Pagination";
import { getEmployees } from "../api/employees.api";

const PAGE_SIZE = 5;

export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  /* ====== STATS ====== */
  const totalEmployees = employees.length;

  const contractEmployees = employees.filter(
    (e) => e.contractType === "Hợp đồng"
  ).length;

  const workingEmployees = employees.filter(
    (e) => e.workStatus === "Đang làm việc"
  ).length;

  const attendanceRate =
    totalEmployees === 0
      ? "0%"
      : `${Math.round((workingEmployees / totalEmployees) * 100)}%`;

  /* ====== PAGING ====== */
  const totalPages = Math.ceil(totalEmployees / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedEmployees = employees.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải báo cáo...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 font-display text-[#101818]">
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

        {/* ====== STATS ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <ReportsStatCard title="Tổng nhân sự" value={totalEmployees} />
          <ReportsStatCard title="Tỷ lệ đi làm" value={attendanceRate} />
          <ReportsStatCard
            title="Cần chú ý"
            value={`${contractEmployees} hợp đồng`}
          />
          <ReportsStatCard
            title="Trang hiện tại"
            value={`${currentPage}/${totalPages || 1}`}
          />
        </div>

        {/* ====== TABLE ====== */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <ReportsDataTable employees={pagedEmployees} />
        </div>

        {/* ====== PAGINATION ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <span className="text-sm text-gray-500">
            Hiển thị{" "}
            <strong>{startIndex + 1}</strong>–
            <strong>
              {Math.min(startIndex + PAGE_SIZE, totalEmployees)}
            </strong>{" "}
            / {totalEmployees}
          </span>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}
