// routes/index.js
const express = require("express");
const router = express.Router();

// Import các router riêng biệt từ các file khác
router.use("/employees", require("./employees.routes"));
router.use("/accounts", require("./accounts.routes"));  // Thêm route accounts
router.use("/salaryGrades", require("./salaryGrades.routes"));
router.use("/attendance", require("./attendance.routers"));
router.use("/departments", require("./departments.routes"));
router.use("/positions", require("./positions.routes"));
router.use("/tasks", require("./tasks.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/permissions", require("./permissions.routes"));
router.use("/permanent-employees", require("./permanentEmployees.routes"));
router.use("/contract-employees", require("./contractEmployees.routes"));
router.use("/approvals", require("./approvals.routes"));
router.use("/professional-qualifications", require("./professionalQualification.routes"));
router.use("/political-affiliations", require("./politicalAffiliation.routes"));
router.use("/familyMembers", require("./familyMembers.routes"));
router.use("/workHistories", require("./workHistory.routes"));
router.use("/workAssignments", require("./workAssignments.routes"));
router.use("/workAssignmentResponses", require("./workAssignmentResponse.routes"));
router.use("/dailyAttendance", require("./dailyAttendance.routes"));
router.use("/attendanceLogs", require("./attendanceLog.routes"));
router.use("/benefits", require("./benefits.routes"));
router.use("/finance", require("./finance.routes"));
router.use("/monthlyAttendance", require("./monthlyAttendance.routes"));
router.use("/monthlySalary", require("./monthlySalary.routes"));
router.use("/payroll-approval", require("./payrollApproval.routes"));
router.use("/payroll-detail", require("./payrollDetail.routes"));




module.exports = router;  // Export router để sử dụng trong app.js hoặc server.js
