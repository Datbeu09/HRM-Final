import React, { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 5;

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
            </tr>
          </thead>

          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
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
                  <td className="border px-3 py-2 text-center">{a.assignedDateText}</td>
                  <td className="border px-3 py-2 text-center">{a.deadlineText}</td>
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
