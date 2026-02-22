import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getEmployeeById } from "../../api/employees.api";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchEmployeeName = async () => {
      if (user?.employeeId) {
        try {
          const emp = await getEmployeeById(user.employeeId);
          setUserName(emp?.data?.name || emp?.name || "Quản trị viên");
        } catch (error) {
          console.error("Lỗi lấy thông tin nhân viên:", error?.message || error);
          setUserName("Quản trị viên");
        }
      }
    };
    fetchEmployeeName();
  }, [user?.employeeId]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ===== permissions helper =====
  // supports: ["EMPLOYEE_VIEW", ...] OR [{code:"EMPLOYEE_VIEW"}, ...]
  const permissionCodes = useMemo(() => {
    const raw = user?.permissions || [];
    if (!Array.isArray(raw)) return new Set();

    const codes = raw
      .map((p) => (typeof p === "string" ? p : p?.code))
      .filter(Boolean);

    return new Set(codes);
  }, [user?.permissions]);

  const hasPerm = (code) => {
    if (!code) return true; // null/undefined => always show
    return permissionCodes.has(code);
  };

  // ===== menu: map đúng theo quyền bạn cung cấp =====
  const menu = useMemo(
    () => [
      // Report / Dashboard
      {
        path: "/",
        icon: "dashboard",
        label: "Báo cáo & Thống kê",
        permissionCode: "REPORT_VIEW",
      },
      // Profile
      {
        path: "/profile/:id",
        icon: "person",
        label: "Thông tin cá nhân",
        permissionCode: "PROFILE_VIEW",
      },
      // Employee
      {
        path: "/employees",
        icon: "group",
        label: "Hồ sơ nhân viên",
        permissionCode: "EMPLOYEE_VIEW",
      },

      // Task / Assignments
      {
        path: "/assignments",
        icon: "assignment_ind",
        label: "Phân công công việc",
        permissionCode: "TASK_ASSIGN",
      },
      {
        path: "/assignments_user",
        icon: "assignment_ind",
        label: "Tiếp nhận công việc",
        permissionCode: "TASK_ACCEPT",
      },

      // Approvals / Requests
      {
        path: "/approvals",
        icon: "fact_check",
        label: "Duyệt yêu cầu",
        permissionCode: "REQUEST_APPROVE",
      },
      {
        path: "/approvals-employee",
        icon: "fact_check",
        label: "Yêu cầu",
        permissionCode: "LEAVE_REQUEST",
      },

      // Attendance
      {
        path: "/attendance-checkin",
        icon: "how_to_reg",
        label: "Chấm công",
        permissionCode: "ATTENDANCE_CHECKIN",
      },
      {
        path: "/attendance-summary",
        icon: "event_available",
        label: "Tổng hợp chấm công",
        permissionCode: "ATTENDANCE_SUMMARY",
      },

      // Finance / Salary
      // {
      //   path: "/finance",
      //   icon: "account_balance",
      //   label: "Tổng quan tài chính",
      //   permissionCode: "FINANCE_OVERVIEW",
      // },
      // {
      //   path: "/salary",
      //   icon: "receipt_long",
      //   label: "Chi tiết lương",
      //   permissionCode: "SALARY_VIEW",
      // },
      {
        path: "/payroll-approval",
        icon: "payments",
        label: "Duyệt bảng lương",
        permissionCode: "SALARY_APPROVE",
      },
      // {
      //   path: "/tax-deduction",
      //   icon: "request_quote",
      //   label: "Thuế khấu trừ",
      //   permissionCode: "TAX_DEDUCTION",
      // },

      // Benefits / Insurance
      // {
      //   path: "/benefits",
      //   icon: "health_and_safety",
      //   label: "Phúc lợi & Bảo hiểm",
      //   permissionCode: "INSURANCE_BENEFIT",
      // },

      // Accounts / Permission
      {
        path: "/account-permission",
        icon: "manage_accounts",
        label: "Quản lý tài khoản & Phân quyền",
        permissionCode: "ACCOUNT_MANAGE",
      },


    ],
    [permissionCodes]
  );

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-gray-200 h-screen fixed">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-200">
        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined">corporate_fare</span>
        </div>
        <div>
          <h2 className="text-sm font-bold">Hệ thống HRM</h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            {userName || "Quản trị viên"}
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menu
            .filter((item) => hasPerm(item.permissionCode))
            .map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                     ${isActive
                      ? "bg-primarySoft text-primary border-r-4 border-primary font-bold"
                      : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
