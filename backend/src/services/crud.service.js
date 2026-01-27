const ApiError = require("../utils/ApiError");
const repo = require("../repositories/crud.repo");

async function list(table, opts) {
  return repo.list(table, opts);
}
async function getOne(table, pkName, pkValue) {
  const row = await repo.findByPk(table, pkName, pkValue);
  if (!row) throw new ApiError(404, `${table} not found`);
  return row;
}
async function create(table, data) {
  const id = await repo.create(table, data);
  return { id };
}
async function update(table, pkName, pkValue, data) {
  const affected = await repo.update(table, pkName, pkValue, data);
  if (!affected) throw new ApiError(404, `${table} not found`);
  return true;
}
async function remove(table, pkName, pkValue) {
  const affected = await repo.remove(table, pkName, pkValue);
  if (!affected) throw new ApiError(404, `${table} not found`);
  return true;
}

module.exports = { list, getOne, create, update, remove };
