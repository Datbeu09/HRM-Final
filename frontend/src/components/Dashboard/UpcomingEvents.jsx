import React from 'react';

const events = [
  { name: "Kỷ niệm 5 năm", date: "15/10/2023", status: "Sắp diễn ra" },
  { name: "Họp kỹ năng mềm", date: "20/10/2023", status: "Đã lên lịch" },
  { name: "Phỏng vấn Senior", date: "12/10/2023", status: "Khẩn cấp" },
];

export default function UpcomingEvents() {
  return (
    <div className="border rounded bg-white shadow flex flex-col h-full min-h-0">
      {/* Header nội bộ */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm sm:text-base font-bold text-gray-900">Sự kiện sắp tới</h2>
        <button className="text-primary text-sm sm:text-base font-medium hover:underline">
          Lịch
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-primarySoft text-primary text-left">
            <tr>
              <th className="px-3 py-2">Sự kiện</th>
              <th className="px-3 py-2">Ngày</th>
              <th className="px-3 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {events.map((e) => (
              <tr key={e.name} className="hover:bg-primarySoft/30 transition">
                <td className="px-3 py-2 font-medium">{e.name}</td>
                <td className="px-3 py-2 text-slate-500">{e.date}</td>
                <td className="px-3 py-2 text-primary font-medium">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
