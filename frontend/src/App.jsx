import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { LayoutProvider } from "./layouts/LayoutContext";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/LoginPages/Login";
import Unauthorized from "./pages/LoginPages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/EmployeesPages/Employees";
import EmployeesDetail from "./pages/EmployeesPages/EmployeesDetail";

import AssignmentAdmin from "./pages/Assignments/AssignmentAdmin";
import AssignmentsUser from "./pages/Assignments/AssignmentsUser";

import Reports from "./pages/Reports";
import ApprovalsAdmin from "./pages/Approvals/ApprovalsAdmin";
import ApprovalsEmployee from "./pages/Approvals/ApprovalsEmployee";

import AccountPermission from "./pages/AccountPermission";
import BenefitsInsurance from "./pages/BenefitsInsurance";
import Notifications from "./pages/Notifications";

// ✅ Attendance pages (bạn đang có trong tree)
import Attendance from "./pages/Attendance/Attendance";
import AttendanceDetail from "./pages/Attendance/AttendanceDetail";

// AccountantPages
import AttendanceSummary from "./pages/Attendance/AttendanceSummary";
import FinanceDashboard from "./pages/FinanceDashboard";
import PayrollApprovalPage from "./pages/Payroll/PayrollApprovalPage";
import PayrollDetail from "./pages/Payroll/PayrollDetail";
import TaxAndDeduction from "./pages/AccountantPages/TaxAndDeduction";
import Profile from "./pages/EmployeesPages/Profile";


export default function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* PROTECTED + LAYOUT */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />

                {/* employees */}
                <Route element={<ProtectedRoute permissions="EMPLOYEE_VIEW" />}>
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/employees/:id" element={<EmployeesDetail />} />
                  <Route path="/profile/:id" element={<Profile />} />
                </Route>

                {/* tasks */}
                {/* tasks - PHÂN CÔNG (admin/hr/giám đốc) */}
                <Route element={<ProtectedRoute permissions="TASK_ASSIGN" />}>
                  <Route path="/assignments" element={<AssignmentAdmin />} />
                </Route>

                {/* tasks - TIẾP NHẬN (kế toán/nhân viên + admin/hr/giám đốc cũng có) */}
                <Route element={<ProtectedRoute permissions="TASK_ACCEPT" />}>
                  <Route path="/assignments_user" element={<AssignmentsUser />} />
                </Route>

                {/* reports */}
                <Route element={<ProtectedRoute permissions="REPORT_VIEW" />}>
                  <Route path="/reports" element={<Reports />} />
                </Route>

                {/* approvals */}
                <Route element={<ProtectedRoute permissions="REQUEST_APPROVE" />}>
                  <Route path="/approvals" element={<ApprovalsAdmin />} />
                </Route>

                {/* employee requests */}
                <Route element={<ProtectedRoute permissions="LEAVE_REQUEST" />}>
                  <Route
                    path="/approvals-employee"
                    element={<ApprovalsEmployee />}
                  />
                </Route>

                {/* notifications */}
                <Route element={<ProtectedRoute permissions="REQUEST_APPROVE" />}>
                  <Route path="/notifications" element={<Notifications />} />
                </Route>

                {/* accounts */}
                <Route element={<ProtectedRoute permissions="ACCOUNT_MANAGE" />}>
                  <Route
                    path="/account-permission"
                    element={<AccountPermission />}
                  />
                </Route>

                {/* benefits */}
                <Route element={<ProtectedRoute permissions="INSURANCE_BENEFIT" />}>
                  <Route path="/benefits" element={<BenefitsInsurance />} />
                </Route>

                {/* ✅ attendance checkin */}
                <Route element={<ProtectedRoute permissions="ATTENDANCE_CHECKIN" />}>
                  <Route path="/attendance-checkin" element={<Attendance />} />
                  <Route
                    path="/attendance/:attendanceId"
                    element={<AttendanceDetail />}
                  />
                </Route>

                {/* attendance summary */}
                <Route element={<ProtectedRoute permissions="ATTENDANCE_SUMMARY" />}>
                  <Route
                    path="/attendance-summary"
                    element={<AttendanceSummary />}
                  />
                </Route>

                {/* finance overview */}
                <Route element={<ProtectedRoute permissions="FINANCE_OVERVIEW" />}>
                  <Route path="/finance" element={<FinanceDashboard />} />
                </Route>

                {/* salary */}
                {/* <Route element={<ProtectedRoute permissions="SALARY_VIEW" />}>
                  <Route path="/salary" element={<PayrollDetail />} />
                  <Route path="/payroll/:id" />
                </Route> */}

                {/* payroll approve */}
                <Route element={<ProtectedRoute permissions="SALARY_APPROVE" />}>
                  <Route
                    path="/payroll-approval"
                    element={<PayrollApprovalPage />}
                  />
                  <Route path="/accountant/payroll/:employeeId" element={<PayrollDetail />} />

                </Route>

                {/* tax */}
                <Route element={<ProtectedRoute permissions="TAX_DEDUCTION" />}>
                  <Route path="/tax-deduction" element={<TaxAndDeduction />} />
                </Route>
              </Route>
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LayoutProvider>
    </AuthProvider>
  );
}
