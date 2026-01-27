import React from "react";
export default function SalaryDetail() {
  return (
    <div className="bg-background-light text-slate-800 min-h-screen flex font-sans">
      {/* MAIN */}
      <main className="ml-64 flex-1 flex flex-col">
        {/* CONTENT */}
        <div className="p-8 space-y-6">
          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-xl border flex justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Tổng thực chi phòng Marketing
                </p>
                <h3 className="text-3xl font-bold">450.000.000 ₫</h3>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-600 text-xs rounded-full">
                Chờ duyệt
              </span>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h4 className="font-bold mb-4">Cơ cấu quỹ lương</h4>
              <div className="flex h-8 rounded overflow-hidden">
                <div className="bg-teal-600 w-[70%]" />
                <div className="bg-amber-400 w-[20%]" />
                <div className="bg-red-400 w-[10%]" />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs">Mã NV</th>
                  <th className="px-6 py-4 text-left text-xs">Họ tên</th>
                  <th className="px-6 py-4 text-left text-xs">Lương</th>
                  <th className="px-6 py-4 text-left text-xs">Ngày công</th>
                  <th className="px-6 py-4 text-left text-xs">Thưởng</th>
                  <th className="px-6 py-4 text-left text-xs">Khấu trừ</th>
                  <th className="px-6 py-4 text-left text-xs">Thực nhận</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-4">NV001</td>
                  <td className="px-6 py-4 font-bold">Trần Văn A</td>
                  <td className="px-6 py-4">25.000.000</td>
                  <td className="px-6 py-4">22/22</td>
                  <td className="px-6 py-4">5.000.000</td>
                  <td className="px-6 py-4 text-red-500">-3.200.000</td>
                  <td className="px-6 py-4 font-bold text-teal-600">
                    26.800.000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="fixed bottom-0 left-64 right-0 h-20 bg-white border-t flex items-center justify-between px-8">
          <button className="border px-5 py-2 rounded text-orange-600">
            Khai báo lại
          </button>
          <button className="bg-teal-600 text-white px-8 py-2 rounded">
            Ký duyệt & Chuyển khoản
          </button>
        </footer>
      </main>
    </div>
  );
}
