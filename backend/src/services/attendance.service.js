const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

// NOTE: req.user phải có employeeId (bạn đang login theo account->employeeId)
function getEmployeeIdFromUser(user) {
  const employeeId = Number(user?.employeeId || 0);
  if (!employeeId) throw new ApiError(401, "Missing employeeId in token");
  return employeeId;
}

function todayYMD() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

module.exports = {
  // ============ ME ============
  async getMeAttendance({ user }) {
    const employeeId = getEmployeeIdFromUser(user);
    const workDate = todayYMD();

    const [tRows] = await pool.query(
      `SELECT id, employeeId, workDate, checkInAt, checkOutAt, workedMinutes, status, note
       FROM attendancelogs
       WHERE employeeId=? AND workDate=?
       LIMIT 1`,
      [employeeId, workDate]
    );
    const today = tRows[0] || null;

    const [rRows] = await pool.query(
      `SELECT id, employeeId, workDate, checkInAt, checkOutAt, workedMinutes, status, note
       FROM attendancelogs
       WHERE employeeId=?
       ORDER BY workDate DESC, id DESC
       LIMIT 4`,
      [employeeId]
    );

    const now = new Date();
    const monthly = await this.getMonthlySummary({
      user,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    return { today, monthly, recent: rRows };
  },

  // ============ CHECK IN ============
  async checkIn({ user }) {
    const employeeId = getEmployeeIdFromUser(user);
    const workDate = todayYMD();

    const [rows] = await pool.query(
      `SELECT * FROM attendancelogs WHERE employeeId=? AND workDate=? LIMIT 1`,
      [employeeId, workDate]
    );
    const existed = rows[0];

    if (existed?.checkInAt) throw new ApiError(400, "Hôm nay bạn đã CHECK IN rồi");

    if (!existed) {
      await pool.query(
        `INSERT INTO attendancelogs
         (employeeId, workDate, checkInAt, workedMinutes, status, createdByAccountId, updatedByAccountId, note, created_at, updated_at)
         VALUES (?, ?, NOW(), 0, 'Đang làm', ?, ?, '', NOW(), NOW())`,
        [employeeId, workDate, user.id || 1, user.id || 1]
      );
    } else {
      await pool.query(
        `UPDATE attendancelogs
         SET checkInAt=NOW(), status='Đang làm', updatedByAccountId=?, updated_at=NOW()
         WHERE id=?`,
        [user.id || 1, existed.id]
      );
    }

    const [out] = await pool.query(
      `SELECT id, employeeId, workDate, checkInAt, checkOutAt, workedMinutes, status, note
       FROM attendancelogs WHERE employeeId=? AND workDate=? LIMIT 1`,
      [employeeId, workDate]
    );
    return out[0];
  },

  // ============ CHECK OUT ============
  async checkOut({ user }) {
    const employeeId = getEmployeeIdFromUser(user);
    const workDate = todayYMD();

    const [rows] = await pool.query(
      `SELECT * FROM attendancelogs WHERE employeeId=? AND workDate=? LIMIT 1`,
      [employeeId, workDate]
    );
    const existed = rows[0];
    if (!existed?.checkInAt) throw new ApiError(400, "Bạn phải CHECK IN trước");
    if (existed?.checkOutAt) throw new ApiError(400, "Hôm nay bạn đã CHECK OUT rồi");

    await pool.query(
      `UPDATE attendancelogs
       SET checkOutAt=NOW(),
           workedMinutes=GREATEST(0, TIMESTAMPDIFF(MINUTE, checkInAt, NOW())),
           status=CASE
             WHEN TIMESTAMPDIFF(MINUTE, checkInAt, NOW()) >= 8*60 THEN 'Đúng giờ'
             ELSE 'Về sớm'
           END,
           updatedByAccountId=?,
           updated_at=NOW()
       WHERE id=?`,
      [user.id || 1, existed.id]
    );

    const [out] = await pool.query(
      `SELECT id, employeeId, workDate, checkInAt, checkOutAt, workedMinutes, status, note
       FROM attendancelogs WHERE id=? LIMIT 1`,
      [existed.id]
    );
    return out[0];
  },

  // ============ MONTHLY SUMMARY ============
  async getMonthlySummary({ user, month, year }) {
    const employeeId = getEmployeeIdFromUser(user);

    const [rows] = await pool.query(
      `SELECT
         SUM(CASE WHEN status IN ('Đúng giờ','Đi muộn','Về sớm','Làm thêm giờ','Đang làm') THEN 1 ELSE 0 END) AS present,
         SUM(CASE WHEN status LIKE '%muộn%' THEN 1 ELSE 0 END) AS late,
         SUM(CASE WHEN status LIKE '%Về sớm%' THEN 1 ELSE 0 END) AS early,
         SUM(COALESCE(workedMinutes,0)) AS totalMinutes
       FROM attendancelogs
       WHERE employeeId=?
         AND MONTH(workDate)=?
         AND YEAR(workDate)=?`,
      [employeeId, month, year]
    );

    const r = rows[0] || {};
    return {
      present: Number(r.present || 0),
      late: Number(r.late || 0),
      early: Number(r.early || 0),
      totalMinutes: Number(r.totalMinutes || 0),
    };
  },

  // ================= FIX QUAN TRỌNG Ở ĐÂY =================
  // dailyattendance + JOIN attendancelogs để lấy giờ vào / ra
  async getEmployeeMonthDetail({ employeeId, month, year }) {
    const [rows] = await pool.query(
      `
      SELECT
        da.id,
        da.employeeId,
        da.date,
        da.status,
        da.hoursWorked,
        da.notes,
        al.checkInAt,
        al.checkOutAt,
        al.workedMinutes
      FROM dailyattendance da
      LEFT JOIN attendancelogs al
        ON da.employeeId = al.employeeId
       AND da.date = al.workDate
      WHERE da.employeeId=?
        AND MONTH(da.date)=?
        AND YEAR(da.date)=?
      ORDER BY da.date
      `,
      [employeeId, month, year]
    );

    const summary = {
      totalPresentDays: rows.filter(r => r.status === "PRESENT").length,
      totalAbsentDays: rows.filter(r => r.status === "ABSENT").length,
      totalLeaveDays: rows.filter(r => r.status === "LEAVE").length,
    };

    return { summary, days: rows };
  },

  async updateDaily({ id, payload }) {
    const [rs] = await pool.query(
      `UPDATE dailyattendance SET notes=?, updated_at=NOW() WHERE id=?`,
      [payload.notes, id]
    );
    if (!rs.affectedRows) throw new ApiError(404, "Not found");
    const [rows] = await pool.query(`SELECT * FROM dailyattendance WHERE id=?`, [id]);
    return rows[0];
  },
};
