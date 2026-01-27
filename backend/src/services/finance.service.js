const db = require("../config/db"); // Kết nối đến cơ sở dữ liệu
// Lấy bảng lương của tất cả nhân viên trong tháng
const getAllEmployeeSalaries = async (month, year) => {
    const query = `
    SELECT 
      e.id AS employeeId,
      e.name AS employeeName,
      ms.baseSalary,
      ms.totalAllowances,
      ms.netSalary
    FROM MonthlySalary ms
    JOIN Employees e ON ms.employeeId = e.id
    WHERE ms.month = ? AND ms.year = ?
  `;
    const [rows] = await db.query(query, [month, year]);
    return rows; // Trả về bảng lương của tất cả nhân viên trong tháng
};


// Lấy thông tin lương của nhân viên theo tháng và năm
const getMonthlySalary = async (employeeId, month, year) => {
    const query = `
    SELECT * FROM MonthlySalary
    WHERE employeeId = ? AND month = ? AND year = ?
  `;
    const [rows] = await db.query(query, [employeeId, month, year]);
    return rows[0]; // Trả về thông tin lương của nhân viên
};

// Tính tổng chi phí lương của tất cả nhân viên trong tháng
const getTotalSalaryCost = async (month, year) => {
    const query = `
    SELECT SUM(netSalary) AS totalSalaryCost
    FROM MonthlySalary
    WHERE month = ? AND year = ?
  `;
    const [rows] = await db.query(query, [month, year]);
    return rows[0]; // Trả về tổng chi phí lương
};

// Phê duyệt bảng lương
const approveSalary = async (salaryId, approvedBy) => {
    const query = `
    UPDATE MonthlySalary
    SET status = 'APPROVED', approvedByAccountId = ?, approvedAt = NOW()
    WHERE id = ?
  `;
    const [result] = await db.query(query, [approvedBy, salaryId]);

    if (result.affectedRows === 0) {
        throw new Error("Không tìm thấy bảng lương");
    }

    // Trả về bản ghi lương đã được phê duyệt
    return { salaryId, status: 'APPROVED', approvedBy };
};

module.exports = {
    getMonthlySalary,
    getTotalSalaryCost,
    approveSalary, 
    getAllEmployeeSalaries
};
