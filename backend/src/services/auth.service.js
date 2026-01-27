const pool = require("../config/db");

async function getPermissionsByRole(role) {
  const [rows] = await pool.query(
    `SELECT p.code
     FROM RolePermissions rp
     JOIN Permissions p ON p.id = rp.permissionId
     WHERE rp.role = ? AND rp.allow = TRUE`,
    [role]
  );
  return rows.map(r => r.code);
}

module.exports = { getPermissionsByRole };
