const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const requireRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { makeCrudController } = require("../controllers/crud.controller");
const { makeCreateSchema, makeUpdateSchema } = require("../validators/crud.validator");
const tables = require("./tables.config");

for (const t of tables) {
  const c = makeCrudController({ table: t.table, pkName: t.pk });

  // READ: cần login + đúng role
  router.get(`/${t.key}`, auth(true), requireRoles(...t.rolesRead), c.list);
  router.get(`/${t.key}/:id`, auth(true), requireRoles(...t.rolesRead), c.getOne);

  // WRITE: cần login + đúng roleWrite
  router.post(`/${t.key}`, auth(true), requireRoles(...t.rolesWrite), validate(makeCreateSchema(t.columns)), c.create);
  router.put(`/${t.key}/:id`, auth(true), requireRoles(...t.rolesWrite), validate(makeUpdateSchema(t.columns)), c.update);
  router.delete(`/${t.key}/:id`, auth(true), requireRoles(...t.rolesWrite), c.remove);
}

module.exports = router;
