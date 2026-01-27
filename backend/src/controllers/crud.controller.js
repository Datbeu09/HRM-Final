const asyncHandler = require("../utils/asyncHandler");
const { ok, created } = require("../utils/response");
const crudService = require("../services/crud.service");

function makeCrudController({ table, pkName, defaultOrderBy = pkName }) {
  return {
    list: asyncHandler(async (req, res) => {
      const { page = 1, pageSize = 50 } = req.query;
      const limit = Math.min(Number(pageSize) || 50, 200);
      const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;
      const data = await crudService.list(table, { limit, offset, orderBy: defaultOrderBy });
      return ok(res, data);
    }),

    getOne: asyncHandler(async (req, res) => {
      const data = await crudService.getOne(table, pkName, req.params.id);
      return ok(res, data);
    }),

    create: asyncHandler(async (req, res) => {
      const data = await crudService.create(table, req.validated.body);
      return created(res, data, `${table}_CREATED`);
    }),

    update: asyncHandler(async (req, res) => {
      await crudService.update(table, pkName, req.params.id, req.validated.body);
      return ok(res, true, `${table}_UPDATED`);
    }),

    remove: asyncHandler(async (req, res) => {
      await crudService.remove(table, pkName, req.params.id);
      return ok(res, true, `${table}_DELETED`);
    }),
  };
}

module.exports = { makeCrudController };
