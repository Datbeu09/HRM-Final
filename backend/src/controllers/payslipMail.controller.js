// src/controllers/payslipMail.controller.js
const puppeteer = require("puppeteer");
const ApiError = require("../utils/ApiError");
const payrollService = require("../services/payrollDetail.service");
const { payslipHtml } = require("../templates/payslip.template");
const { createTransporter } = require("../utils/mailer");

module.exports = {
  async sendPayslipEmail(req, res, next) {
    try {
      const { employeeId } = req.params;
      const { month } = req.query;

      if (!employeeId) throw new ApiError(400, "employeeId is required");
      if (!month) throw new ApiError(400, "month is required (YYYY-MM)");

      // 1) lấy raw
      const raw = await payrollService.getPayrollDetail({
        employeeId: Number(employeeId),
        monthStr: month,
      });

      // 2) normalize để render template
      const model = payrollService.normalizeForPayslip(raw);

      if (String(model?.payroll?.status || "").toLowerCase() === "missing") {
        throw new ApiError(400, "Chưa có bảng lương để gửi email");
      }

      // 3) render HTML -> PDF
      const html = payslipHtml(model);

      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
      });

      await browser.close();

      // 4) send mail
      const transporter = createTransporter();

      const to = "deaftt09@gmail.com";
      const subject = `Phiếu lương ${model.monthStr} - ${model.employee.name || ""}`.trim();

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html: `
          <p>Xin chào,</p>
          <p>Đính kèm là phiếu lương tháng <b>${model.monthStr}</b> của nhân viên <b>${model.employee.name}</b>.</p>
          <p>Trân trọng.</p>
        `,
        attachments: [
          {
            filename: `payslip-${model.monthStr}-${model.employee.employeeCode || model.employee.name || "employee"}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      return res.json({ success: true, message: "Đã gửi phiếu lương qua email", to });
    } catch (e) {
      next(e);
    }
  },
};