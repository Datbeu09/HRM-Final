const MonthlySalaryDetailService = require("../services/monthlySalaryDetail.service");

const MonthlySalaryDetailController = {
  async create(req, res) {
    try {
      const id = await MonthlySalaryDetailService.create(req.body);
      res.status(201).json({
        message: "Tạo chi tiết lương thành công",
        id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi tạo chi tiết lương",
        error: error.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const data = await MonthlySalaryDetailService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi lấy danh sách chi tiết lương",
        error: error.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const data = await MonthlySalaryDetailService.getById(req.params.id);
      if (!data) {
        return res.status(404).json({
          message: "Không tìm thấy chi tiết lương",
        });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi lấy chi tiết lương",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const affected = await MonthlySalaryDetailService.update(
        req.params.id,
        req.body
      );

      if (!affected) {
        return res.status(404).json({
          message: "Không tìm thấy chi tiết lương để cập nhật",
        });
      }

      res.json({ message: "Cập nhật chi tiết lương thành công" });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi cập nhật chi tiết lương",
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const affected = await MonthlySalaryDetailService.delete(req.params.id);

      if (!affected) {
        return res.status(404).json({
          message: "Không tìm thấy chi tiết lương để xoá",
        });
      }

      res.json({ message: "Xoá chi tiết lương thành công" });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi xoá chi tiết lương",
        error: error.message,
      });
    }
  },
};

module.exports = MonthlySalaryDetailController;