import React, { useEffect, useMemo, useState } from "react";
import { formatDMY } from "../../../utils/dateOnly";

const PAGE_SIZE = 5;

// ✅ Badge trạng thái (map theo DB)
const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();

  if (s === "PENDING") {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-semibold">
        Chờ tiếp nhận
      </span>
    );
  }

  if (s === "IN_PROGRESS") {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700 font-semibold">
        Đang thực hiện
      </span>
    );
  }

  if (s === "DONE") {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 font-semibold">
        Hoàn thành
      </span>
    );
  }

  if (s === "REJECTED") {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-50 text-red-700 font-semibold">
        Từ chối
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-slate-50 text-slate-700 font-semibold">
      N/A
    </span>
  );
};

const AssignmentTable = ({ assignments = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setCurrentPage(1), [assignments]);

  const totalPages = Math.ceil(assignments.length / PAGE_SIZE);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return assignments.slice(start, start + PAGE_SIZE);
  }, [assignments, currentPage]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr className="text-gray-600">
              <th className="border px-3 py-2 text-left">Mã NV</th>
              <th className="border px-3 py-2 text-left">Tên NV</th>
              <th className="border px-3 py-2 text-left">Phòng ban</th>
              <th className="border px-3 py-2 text-left">Công việc</th>
              <th className="border px-3 py-2 text-center">Ngày giao</th>
              <th className="border px-3 py-2 text-center">Deadline</th>
              <th className="border px-3 py-2 text-center">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Không có công việc phù hợp
                </td>
              </tr>
            ) : (
              pagedData.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="border px-3 py-2">{a.employeeCode}</td>
                  <td className="border px-3 py-2">{a.employeeName}</td>
                  <td className="border px-3 py-2">{a.departmentName}</td>
                  <td className="border px-3 py-2">{a.taskName}</td>

                  {/* ✅ Không hiển thị raw text nữa: normalize/format */}
                  <td className="border px-3 py-2 text-center">
                    {formatDMY(a.assignedDateText || a.assignedDate)}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {formatDMY(a.deadlineText || a.deadline)}
                  </td>

                  {/* ✅ Trạng thái */}
                  <td className="border px-3 py-2 text-center">
                    {statusBadge(a.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            ← Trước
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentTable;