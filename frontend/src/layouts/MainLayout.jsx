import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header"; // Header chung

export default function MainLayout() {
  // Mapping pathname => title
const pageTitles = {
  // ===== CORE =====
  "/": "Dashboard",
  "/employees": "Hồ sơ nhân viên",
  "/employees/:id": "Chi tiết nhân viên",

  // ===== ASSIGNMENTS =====
  "/assignments": "Phân công công việc (Quản lý)",
  "/assignments_user": "Phân công công việc",

  // ===== REPORT / APPROVAL =====
  "/reports": "Báo cáo & Thống kê",
  "/approvals": "Duyệt yêu cầu",
  "/approvals-employee": "Yêu cầu",

  // ===== SYSTEM =====
  "/account-permission": "Quản lý tài khoản & Phân quyền",
  "/benefits": "Phúc lợi & Bảo hiểm",
  "/notifications": "Thông báo & Nhắc nhở",

  // ===== ACCOUNTANT =====
  "/finance": "Tổng quan tài chính",
  "/attendance-summary": "Tổng hợp chấm công",
  "/Finance-approval": "Duyệt bảng lương",
  "/Finance/:id": "Chi tiết bảng lương",
  "/salary/:id": "Chi tiết lương",
  "/tax-deduction": "Thuế & Khấu trừ",

  // ===== AUTH =====
  "/login": "Đăng nhập",
  "/unauthorized": "Không có quyền truy cập",
};

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar cố định */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <Header pageTitles={pageTitles} />

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
