// src/templates/payslip.template.js

const formatVND = (n) => `${Number(n || 0).toLocaleString("vi-VN")} ₫`;

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildRows(items = [], type = "income") {
  // items: [{label, value, sub}]
  // type: income | deduct
  const isDeduct = type === "deduct";

  return items
    .map((it) => {
      const label = escapeHtml(it.label);
      const sub = it.sub ? `<div class="hint">${escapeHtml(it.sub)}</div>` : "";
      const val = Number(it.value || 0);
      const amountText = isDeduct
        ? `- ${escapeHtml(formatVND(val))}`
        : escapeHtml(formatVND(val));

      return `
        <div class="row">
          <div>
            <div class="label">${label}</div>
            ${sub}
          </div>
          <div class="amount ${isDeduct ? "neg" : ""}">${amountText}</div>
        </div>
      `;
    })
    .join("");
}

function payslipHtml(data) {
  const emp = data.employee || {};
  const pr = data.payroll || {};
  const summary = data.summary || { totalIncome: 0, totalDeduct: 0, net: 0 };

  // Tách items hiển thị: giống UI bạn đang render
  const incomeHTML = buildRows(data.incomeItems || [], "income");
  const deductHTML = buildRows(data.deductItems || [], "deduct");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }
    body { margin: 0; padding: 24px; background: #fff; color: #0f172a; }
    .card { border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; }
    .header { padding: 18px 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; gap: 16px; }
    .title { font-weight: 800; font-size: 16px; }
    .meta { font-size: 12px; color: #475569; line-height: 1.6; }
    .meta b { color: #0f172a; }

    .grid { display: grid; grid-template-columns: 1fr 1fr; }
    .col { padding: 18px 20px; }
    .col + .col { border-left: 1px solid #e5e7eb; }
    .col h3 { margin: 0 0 14px; font-size: 14px; letter-spacing: .5px; }
    .income h3 { color: #0ea5a6; }
    .deduct h3 { color: #ef4444; }

    .row { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #f1f5f9; gap: 16px; }
    .row:last-child { border-bottom: none; }
    .label { font-size: 13px; color: #0f172a; }
    .hint { font-size: 11px; color: #64748b; margin-top: 4px; }
    .amount { font-size: 13px; font-weight: 700; white-space: nowrap; }
    .neg { color: #ef4444; }

    .footer { border-top: 1px solid #e5e7eb; padding: 16px 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; align-items: end; }
    .sumTitle { font-size: 11px; color: #64748b; letter-spacing: .6px; font-weight: 700; }
    .sumVal { margin-top: 6px; font-size: 22px; font-weight: 900; }
    .sumVal.neg { color: #ef4444; }
    .sumVal.net { color: #0ea5a6; text-align: right; }
    .right { text-align: right; }

    .subnote { padding: 0 20px 18px; font-size: 12px; color: #475569; }
  </style>
</head>

<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="title">PHIẾU LƯƠNG THÁNG ${escapeHtml(data.monthStr || "")}</div>
        <div class="meta">
          Nhân viên: <b>${escapeHtml(emp.name || "—")}</b> (${escapeHtml(emp.employeeCode || "—")})<br/>
          Phòng ban: <b>${escapeHtml(emp.department || "—")}</b> — Chức vụ: <b>${escapeHtml(emp.position || emp.title || "—")}</b><br/>
          Ngày công: <b>${escapeHtml(pr.totalDaysWorked ?? 0)}</b> — Locked: <b>${pr.locked ? "Yes" : "No"}</b>
        </div>
      </div>
      <div class="meta right">
        Trạng thái: <b>${escapeHtml(pr.status || "Pending")}</b>
      </div>
    </div>

    <div class="grid">
      <div class="col income">
        <h3>CÁC KHOẢN THU NHẬP</h3>
        ${incomeHTML || `<div class="meta">Không có dữ liệu thu nhập.</div>`}
      </div>

      <div class="col deduct">
        <h3>CÁC KHOẢN KHẤU TRỪ</h3>
        ${deductHTML || `<div class="meta">Không có dữ liệu khấu trừ.</div>`}
      </div>
    </div>

    <div class="footer">
      <div>
        <div class="sumTitle">TỔNG THU NHẬP</div>
        <div class="sumVal">${escapeHtml(formatVND(summary.totalIncome))}</div>
      </div>
      <div>
        <div class="sumTitle">TỔNG KHẤU TRỪ</div>
        <div class="sumVal neg">${escapeHtml(formatVND(summary.totalDeduct))}</div>
      </div>
      <div class="right">
        <div class="sumTitle">THỰC LĨNH (NET PAY)</div>
        <div class="sumVal net">${escapeHtml(formatVND(summary.net))}</div>
      </div>
    </div>

    <div class="subnote">
      Ghi chú: Phiếu lương được tạo tự động từ hệ thống HRM.
    </div>
  </div>
</body>
</html>`;
}

module.exports = { payslipHtml };