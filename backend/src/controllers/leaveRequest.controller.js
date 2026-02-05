const LeaveRequestService = require("../services/leaveRequest.service");

const LeaveRequestController = {
  // ================= CREATE =================
  async create(req, res, next) {
    try {
      const {
        employeeId,
        leaveType,
        startDate,
        endDate,
        totalDays,
      } = req.body;

      // Validate tối thiểu
      if (!employeeId || !leaveType || !startDate || !endDate || !totalDays) {
        return res.status(400).json({
          message: "Thiếu dữ liệu bắt buộc",
        });
      }

      const id = await LeaveRequestService.create(req.body);

      return res.status(201).json({
        message: "Tạo đơn nghỉ phép thành công",
        id,
      });
    } catch (error) {
      console.error("CREATE LEAVE REQUEST ERROR:", error);
      next(error);
    }
  },

  // ================= GET ALL =================
  async getAll(req, res, next) {
    try {
      const data = await LeaveRequestService.getAll();
      return res.status(200).json(data);
    } catch (error) {
      console.error("GET ALL LEAVE REQUEST ERROR:", error);
      next(error);
    }
  },

  // ================= GET BY ID =================
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "Thiếu ID",
        });
      }

      const data = await LeaveRequestService.getById(id);

      if (!data) {
        return res.status(404).json({
          message: "Không tìm thấy đơn nghỉ phép",
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("GET LEAVE REQUEST BY ID ERROR:", error);
      next(error);
    }
  },

  // ================= UPDATE =================
  async update(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "Thiếu ID",
        });
      }

      const affected = await LeaveRequestService.update(id, req.body);

      if (affected === 0) {
        return res.status(404).json({
          message: "Không tìm thấy đơn nghỉ phép để cập nhật",
        });
      }

      return res.status(200).json({
        message: "Cập nhật đơn nghỉ phép thành công",
      });
    } catch (error) {
      console.error("UPDATE LEAVE REQUEST ERROR:", error);
      next(error);
    }
  },

  // ================= DELETE =================
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "Thiếu ID",
        });
      }

      const affected = await LeaveRequestService.delete(id);

      if (affected === 0) {
        return res.status(404).json({
          message: "Không tìm thấy đơn nghỉ phép để xoá",
        });
      }

      return res.status(200).json({
        message: "Xoá đơn nghỉ phép thành công",
      });
    } catch (error) {
      console.error("DELETE LEAVE REQUEST ERROR:", error);
      next(error);
    }
  },
};

module.exports = LeaveRequestController;