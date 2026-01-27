import React from "react";

export default function TaxAndDeduction() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main">
      {/* === MAIN === */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* CONTENT */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-screen-2xl mx-auto space-y-6">

            {/* SUMMARY BAR (THIẾT KẾ THÊM) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Tổng lương gộp"
                value="43,000,000 ₫"
              />
              <SummaryCard
                title="Tổng khấu trừ"
                value="6,665,000 ₫"
              />
              <SummaryCard
                title="Thuế TNCN"
                value="4,250,000 ₫"
              />
              <SummaryCard
                title="Thực nhận"
                value="36,335,000 ₫"
                primary
              />
            </section>

            {/* TABLE */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-background-light dark:bg-background-dark text-text-secondary">
                    <tr className="border-b border-border-light dark:border-border-dark">
                      <th className="px-6 py-4 text-left font-semibold">
                        Nhân viên
                      </th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Lương gộp
                      </th>
                      <th className="px-6 py-4 text-right font-semibold text-primary bg-primary/5">
                        Thực nhận
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    <TableRow
                      name="Nguyen Van A"
                      gross="25,000,000 ₫"
                      net="20,675,000 ₫"
                    />
                    <TableRow
                      name="Tran Thi B"
                      gross="18,000,000 ₫"
                      net="15,660,000 ₫"
                    />
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENT PHỤ ================= */

function SummaryCard({ title, value, primary }) {
  return (
    <div
      className={`
        p-5 rounded-2xl border
        bg-white dark:bg-surface-dark
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-md
        ${primary ? "border-primary/30 bg-primary/5" : "border-border-light dark:border-border-dark"}
      `}
    >
      <p className="text-xs uppercase font-semibold tracking-wide text-text-secondary">
        {title}
      </p>
      <p
        className={`mt-2 text-2xl font-bold tabular-nums ${
          primary ? "text-primary" : "text-text-main"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TableRow({ name, gross, net }) {
  return (
    <tr className="group transition hover:bg-background-light/60 dark:hover:bg-background-dark/60">
      <td className="px-6 py-4 font-medium">
        {name}
      </td>
      <td className="px-6 py-4 text-right tabular-nums text-text-secondary">
        {gross}
      </td>
      <td
        className="
          px-6 py-4 text-right font-bold tabular-nums
          text-primary bg-primary/5
          transition group-hover:bg-primary/10
        "
      >
        {net}
      </td>
    </tr>
  );
}
