const SalaryPaymentService = require("../services/salaryPayment.service");

const SalaryPaymentController = {
  async create(req, res) {
    try {
      const id = await SalaryPaymentService.create(req.body);
      res.status(201).json({
        message: "Tạo chi tiết thanh toán lương thành công",
        id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi tạo thanh toán lương",
        error: error.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const data = await SalaryPaymentService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi lấy danh sách thanh toán lương",
        error: error.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const data = await SalaryPaymentService.getById(req.params.id);
      if (!data) {
        return res.status(404).json({
          message: "Không tìm thấy thanh toán lương",
        });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi lấy chi tiết thanh toán lương",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const affected = await SalaryPaymentService.update(
        req.params.id,
        req.body
      );

      if (!affected) {
        return res.status(404).json({
          message: "Không tìm thấy thanh toán lương để cập nhật",
        });
      }

      res.json({ message: "Cập nhật thanh toán lương thành công" });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi cập nhật thanh toán lương",
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const affected = await SalaryPaymentService.delete(req.params.id);

      if (!affected) {
        return res.status(404).json({
          message: "Không tìm thấy thanh toán lương để xoá",
        });
      }

      res.json({ message: "Xoá thanh toán lương thành công" });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi xoá thanh toán lương",
        error: error.message,
      });
    }
  },
};

module.exports = SalaryPaymentController;