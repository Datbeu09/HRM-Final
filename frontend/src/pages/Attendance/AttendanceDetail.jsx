import React from "react";

export default function AttendanceDetail() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex font-[Inter]">

      {/* MAIN */}
      <main className="flex-1 ml-64 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <span className="material-icons-round text-slate-600 dark:text-slate-400">
                arrow_back
              </span>
            </button>

            <div>
              <h2 className="text-2xl font-bold">Chi tiết chấm công</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 text-sm">Nhân viên:</span>
                <span className="font-semibold text-sm">Nguyễn Văn A</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded">
                  #EMP001
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer">
              <span className="material-icons-round text-slate-400 text-sm">
                calendar_month
              </span>
              <span className="text-sm font-medium">Tháng 05/2024</span>
              <span className="material-icons-round text-slate-400 text-sm">
                expand_more
              </span>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90">
              <span className="material-icons-round text-sm">
                file_download
              </span>
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
              <tr>
                {[
                  "Ngày",
                  "Thứ",
                  "Giờ vào",
                  "Giờ ra",
                  "Tổng giờ",
                  "Trạng thái công",
                  "Ghi chú",
                ].map((h) => (
                  <th key={h} className="px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-6 py-4 font-medium">01/05/2024</td>
                <td className="px-6 py-4">Thứ 4</td>
                <td className="px-6 py-4 font-semibold">08:00</td>
                <td className="px-6 py-4 font-semibold">17:30</td>
                <td className="px-6 py-4">8h 30m</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold">
                    <span className="material-icons-round text-sm">
                      check_circle
                    </span>
                    Có công
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-400 italic">
                  --
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
