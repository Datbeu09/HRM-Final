// controllers/salaryPaymentBatch.controller.js
const SalaryPaymentBatchService = require("../services/salaryPaymentBatch.service");

const SalaryPaymentBatchController = {
  async create(req, res, next) {
    try {
      const id = await SalaryPaymentBatchService.create(req.body);
      return res.status(201).json({
        message: "Tạo đợt chi lương thành công",
        id,
      });
    } catch (error) {
      console.error("CREATE SALARY PAYMENT BATCH ERROR:", error);
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await SalaryPaymentBatchService.getAll();
      return res.status(200).json(data);
    } catch (error) {
      console.error("GET ALL SALARY PAYMENT BATCH ERROR:", error);
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const data = await SalaryPaymentBatchService.getById(id);
      if (!data) {
        return res.status(404).json({
          message: "Không tìm thấy đợt chi lương",
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("GET SALARY PAYMENT BATCH BY ID ERROR:", error);
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const affected = await SalaryPaymentBatchService.update(id, req.body);
      if (affected === 0) {
        return res.status(404).json({
          message: "Không tìm thấy đợt chi lương để cập nhật",
        });
      }

      return res.status(200).json({
        message: "Cập nhật đợt chi lương thành công",
      });
    } catch (error) {
      console.error("UPDATE SALARY PAYMENT BATCH ERROR:", error);
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const affected = await SalaryPaymentBatchService.delete(id);
      if (affected === 0) {
        return res.status(404).json({
          message: "Không tìm thấy đợt chi lương để xoá",
        });
      }

      return res.status(200).json({
        message: "Xoá đợt chi lương thành công",
      });
    } catch (error) {
      console.error("DELETE SALARY PAYMENT BATCH ERROR:", error);
      next(error);
    }
  },
};

module.exports = SalaryPaymentBatchController;