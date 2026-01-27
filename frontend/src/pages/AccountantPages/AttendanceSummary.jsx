import React, { useState, useEffect, useMemo } from "react";

import AttendanceStats from "../../components/AttendanceSummary/AttendanceStats";
import AttendanceTable from "../../components/AttendanceSummary/AttendanceTable";

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

  // Fetch employees list
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees(); // bạn đang dùng employees.api.js rồi
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

  /**
   * Map data cho AttendanceTable:
   * RowAS đang cần: { id, name, code, actual }
   *
   * DB attendance: { id, employeeId, month, year, totalDaysWorked, status, ... }
   * employee: { id, name, employeeCode, ... } (tùy backend bạn trả về)
   */
  const tableData = useMemo(() => {
    const empMap = new Map(employees.map((e) => [String(e.id), e]));

    // Nếu bạn muốn lọc theo tháng/năm hiện tại: tự set ở đây
    // Ví dụ: const month = 1; const year = 2026;
    // const filtered = attendanceRows.filter(r => r.month===month && r.year===year);

    return attendanceRows.map((r) => {
      const emp = empMap.get(String(r.employeeId)) || {};
      return {
        id: r.id, // id bản ghi attendance
        employeeId: r.employeeId,
        name: emp.name || emp.name || "N/A",
        code: emp.employeeCode || emp.code || "N/A",
        actual: r.totalDaysWorked ?? 0,
        standard: STANDARD_DAYS,
        status: r.status,
        locked: r.locked,
      };
    });
  }, [employees, attendanceRows]);

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

            <AttendanceTable
              attendanceData={tableData}
              loading={loadingAttendance}
              error={errorAttendance}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
