// src/utils/mailer.js
const nodemailer = require("nodemailer");

function createTransporter() {
  // Dùng Gmail SMTP (cần App Password)
  // ENV:
  // SMTP_USER=your_gmail@gmail.com
  // SMTP_PASS=xxxx xxxx xxxx xxxx (App Password)
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("Missing SMTP_USER / SMTP_PASS in environment variables");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/**
 * ✅ FIX: define hàm sendPayrollExcel để service gọi được
 * Giữ đúng param bạn đang truyền: { to, subject, text, filename, buffer }
 */
async function sendPayrollExcel({ to, subject, text, filename, buffer }) {
  if (!to) throw new Error("sendPayrollExcel: 'to' is required");
  if (!buffer) throw new Error("sendPayrollExcel: 'buffer' is required");

  const transporter = createTransporter();

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: subject || "Payroll Excel",
    text: text || "",
    attachments: [
      {
        filename: filename || "payroll.xlsx",
        content: buffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  return true;
}

module.exports = { createTransporter, sendPayrollExcel };