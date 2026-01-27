import React from "react";

export default function PayrollDetail() {
  return (
    <div className="font-display bg-background-light text-text-main overflow-hidden antialiased">
      <div className="flex h-screen w-full overflow-hidden">
        {/* MAIN */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light">
          {/* TABLE */}
          <section className="flex-1 px-8 py-6 overflow-hidden">
            <div className="overflow-auto border border-slate-200 rounded-2xl bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4 text-left">Nhân viên</th>
                    <th className="px-6 py-4 text-right">Lương cơ bản</th>
                    <th className="px-6 py-4 text-right">Thực lĩnh</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold">Nguyễn Văn A</td>
                    <td className="px-6 py-4 text-right">15,000,000</td>
                    <td className="px-6 py-4 text-right text-primary font-bold">
                      15,950,000
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold">Trần Thị B</td>
                    <td className="px-6 py-4 text-right">12,000,000</td>
                    <td className="px-6 py-4 text-right text-primary font-bold">
                      12,540,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
