const pool = require("../config/db");

exports.getDashboard = async (req, res, next) => {
  try {
    const { month } = req.query;

    const [[salary]] = await pool.query(
      `
      SELECT 
        SUM(netSalary) AS totalPaid,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pendingCount
      FROM MonthlySalary
      WHERE month = ?
      `,
      [month]
    );

    res.json({
      totalPaid: salary.totalPaid || 0,
      pendingCount: salary.pendingCount || 0
    });
  } catch (err) {
    next(err);
  }
};

exports.getTaxSummary = async (req, res, next) => {
  try {
    const { month } = req.query;

    const [[row]] = await pool.query(
      `
      SELECT SUM(taxAmount) AS totalTax
      FROM MonthlySalary
      WHERE month = ?
      `,
      [month]
    );

    res.json({ totalTax: row.totalTax || 0 });
  } catch (err) {
    next(err);
  }
};
