import React, { useEffect, useState, useCallback } from "react";
import { getEmployees } from "../../api/employees.api";
import { getDepartments } from "../../api/departments.api"; // Fetch departments
import { useNavigate } from "react-router-dom";
import FormatDate from "../common/formatDate";

const isWithinLastMonth = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const startDate = new Date(dateString);
  if (Number.isNaN(startDate.getTime())) return false;

  const diffDays = (today - startDate) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
};

export default function RecentEmployees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // State to store departments
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const loadEmployees = useCallback(() => {
    setLoading(true);
    Promise.all([getEmployees(), getDepartments()]) // Fetch both employees and departments
      .then(([employeeData, departmentData]) => {
        const departmentMap = departmentData.reduce((acc, dept) => {
          acc[dept.id] = dept.departmentName; // Create a map of departmentId -> departmentName
          return acc;
        }, {});

        const recentEmployees = employeeData.filter((e) =>
          isWithinLastMonth(e.startDate)
        );

        // Attach department name to each employee
        const employeesWithDepartments = recentEmployees.map((e) => ({
          ...e,
          departmentName: departmentMap[e.departmentId] || "N/A", // Attach department name
        }));

        const next = employeesWithDepartments.slice(0, page * 5);
        setEmployees(next);
        setHasMore(recentEmployees.length > next.length);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    loadEmployees();
  }, [page, loadEmployees]);

  const handleScroll = (e) => {
    const el = e.target;
    const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2; // avoid pixel discrepancy
    if (bottom && hasMore && !loading) setPage((p) => p + 1);
  };

  return (
    <div className="border rounded bg-white shadow flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm sm:text-base font-bold text-gray-900">
          Nhân viên mới (30 ngày)
        </h2>
        <button
          onClick={() => navigate("/employees")}
          className="text-primary text-sm sm:text-base font-medium hover:underline"
        >
          Xem tất cả
        </button>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "400px" }} onScroll={handleScroll}>
        {loading ? (
          <p className="p-3 text-sm text-slate-500">Đang tải dữ liệu...</p>
        ) : employees.length === 0 ? (
          <p className="p-3 text-sm text-slate-500">Không có nhân viên mới trong tháng</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-primarySoft text-primary text-left">
              <tr>
                <th className="px-3 py-2">Mã NV</th>
                <th className="px-3 py-2">Họ tên</th>
                <th className="px-3 py-2">Phòng ban</th>
                <th className="px-3 py-2">Ngày vào</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-primarySoft/30 transition">
                  <td className="px-3 py-2 font-medium">{e.employeeCode}</td>
                  <td className="px-3 py-2">{e.name}</td>
                  <td className="px-3 py-2 text-slate-500">{e.departmentName}</td> {/* Display departmentName */}
                  <td className="px-3 py-2 text-slate-500">
                    <FormatDate dateString={e.startDate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}