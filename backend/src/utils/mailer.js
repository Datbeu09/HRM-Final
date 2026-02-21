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

module.exports = { createTransporter };