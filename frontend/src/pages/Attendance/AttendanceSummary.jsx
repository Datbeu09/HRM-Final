// src/pages/AccountantPages/AttendanceSummary.jsx
import React, { useState, useEffect, useMemo } from "react";

import AttendanceStats from "../../components/AttendanceSummary/AttendanceStats";
import AttendanceTable from "../../components/AttendanceSummary/AttendanceTable";
import Pagination from "../../components/common/Pagination";

import { getEmployees } from "../../api/employees.api";
import { getAllMonthlyAttendance } from "../../api/monthlyAttendance.api";

const STANDARD_DAYS = 22;

export default function AttendanceSummary() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRows, setAttendanceRows] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const [errorEmployees, setErrorEmployees] = useState(null);
  const [errorAttendance, setErrorAttendance] = useState(null);

  // ✅ Paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // bạn muốn 5/10 đều được

  // Fetch employees list
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        setErrorEmployees("Lỗi khi tải dữ liệu nhân viên");
      } finally {
        setLoadingEmployees(false);
      }
    }
    fetchEmployees();
  }, []);

  // Fetch monthly attendance list
  useEffect(() => {
    async function fetchAttendance() {
      try {
        const rows = await getAllMonthlyAttendance();
        setAttendanceRows(Array.isArray(rows) ? rows : []);
      } catch (err) {
        setErrorAttendance("Lỗi khi tải dữ liệu chấm công tháng");
      } finally {
        setLoadingAttendance(false);
      }
    }
    fetchAttendance();
  }, []);

  const employeeCount = employees.length;

  // ✅ Map data cho AttendanceTable
  const tableData = useMemo(() => {
    const empMap = new Map(employees.map((e) => [String(e.id), e]));

    return attendanceRows.map((r) => {
      const emp = empMap.get(String(r.employeeId)) || {};
      return {
        id: r.id, // id bản ghi attendance
        employeeId: r.employeeId,
        name: emp?.name || "N/A",
        code: emp?.employeeCode || emp?.code || "N/A",
        actual: r.totalDaysWorked ?? 0,
        standard: STANDARD_DAYS,
        status: r.status,
        locked: r.locked,
      };
    });
  }, [employees, attendanceRows]);

  // ✅ khi data đổi (load lại) => về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [tableData.length]);

  const totalPages = Math.max(1, Math.ceil(tableData.length / itemsPerPage));

  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return tableData.slice(startIndex, startIndex + itemsPerPage);
  }, [tableData, currentPage]);

  return (
    <div className="light font-display h-screen flex overflow-hidden bg-background-light text-[#111718]">
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            <AttendanceStats
              employeeCount={employeeCount}
              loading={loadingEmployees}
              error={errorEmployees}
            />

            {/* ✅ Table chỉ nhận data của trang hiện tại */}
            <div className="space-y-3">
              <AttendanceTable
                attendanceData={currentTableData}
                loading={loadingAttendance}
                error={errorAttendance}
              />

              {/* ✅ Paging nằm dưới table */}
              {!loadingAttendance && !errorAttendance && tableData.length > 0 && (
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
