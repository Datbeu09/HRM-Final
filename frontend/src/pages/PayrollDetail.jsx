import React from "react";

export default function PayrollDetail() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex text-gray-800 font-[Inter]">
      {/* MAIN */}
      <main className="ml-64 flex-1">
        {/* CONTENT */}
        <div className="p-8">

          {/* EMPLOYEE INFO */}
          <div className="mb-6 flex justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="material-icons-round text-4xl text-gray-400">account_circle</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Nguyễn Văn A</h2>
                <p className="text-gray-500">
                  Mã nhân viên: NV001 • Chức vụ: Chuyên viên Marketing
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase font-semibold">
                Kỳ lương tháng 10/2023
              </p>
              <span className="px-3 py-1 bg-amber-100 text-amber-600 text-xs font-bold rounded-full">
                Đang chờ duyệt
              </span>
            </div>
          </div>

          {/* PAYROLL */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border overflow-hidden">
            <div className="grid md:grid-cols-2 divide-x">
              {/* INCOME */}
              <div className="p-8">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <span className="material-icons-round">add_circle_outline</span>
                  Các khoản thu nhập
                </h3>

                {[
                  ["Lương cơ bản", "12,000,000 ₫"],
                  ["Lương làm thêm giờ (12h)", "1,500,000 ₫"],
                  ["Thưởng hiệu suất", "1,200,000 ₫"],
                  ["Phụ cấp ăn trưa", "660,000 ₫"],
                  ["Phụ cấp điện thoại & Xăng xe", "500,000 ₫"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">{label}</span><span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              {/* DEDUCTION */}
              <div className="p-8 bg-gray-50">
                <h3 className="text-lg font-bold text-red-500 mb-6 flex items-center gap-2">
                  <span className="material-icons-round">remove_circle_outline</span>
                  Các khoản khấu trừ
                </h3>

                {[
                  ["BHXH (8%)", "- 960,000 ₫"],
                  ["BHYT (1.5%)", "- 180,000 ₫"],
                  ["BHTN (1%)", "- 120,000 ₫"],
                  ["Thuế TNCN", "- 475,000 ₫"],
                  ["Phí công đoàn", "- 100,000 ₫"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-red-500">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="p-8 border-t grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-xs font-bold text-gray-400">TỔNG THU NHẬP</p>
                <p className="text-2xl font-bold">15,860,000 ₫</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400">TỔNG KHẤU TRỪ</p>
                <p className="text-2xl font-bold text-red-500">1,835,000 ₫</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-primary">THỰC LĨNH</p>
                <p className="text-4xl font-black text-primary">14,025,000 ₫</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}