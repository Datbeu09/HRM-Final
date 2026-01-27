const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const requireRoles = require("../middlewares/role.middleware");
const c = require("../controllers/views.controller");

// views: ai login cũng xem được (tuỳ bạn siết lại)
router.get("/employees-with-family", auth(true), requireRoles("ADMIN","HR","DEPARTMENT_HEAD","ACCOUNTANT","EMPLOYEE"), c.employeesWithFamily);
router.get("/employee-family-rows", auth(true), requireRoles("ADMIN","HR","DEPARTMENT_HEAD","ACCOUNTANT","EMPLOYEE"), c.employeeFamilyRows);

module.exports = router;
