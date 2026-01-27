module.exports = {
  // mặc định
  read: ["ADMIN", "HR", "DEPARTMENT_HEAD", "ACCOUNTANT", "EMPLOYEE"],
  writeHR: ["ADMIN", "HR"],
  writeAccountant: ["ADMIN", "ACCOUNTANT"],
  writeDeptHead: ["ADMIN", "DEPARTMENT_HEAD", "HR"],
  adminOnly: ["ADMIN"],
};
