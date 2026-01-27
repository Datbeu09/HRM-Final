const { z } = require("zod");
const { pick } = require("../utils/sql");

function makeCreateSchema(columns) {
  return z.object({
    body: z.object(
      columns.reduce((acc, c) => {
        acc[c] = z.any().optional();
        return acc;
      }, {})
    ).transform((val) => pick(val, columns)),
    params: z.object({}),
    query: z.object({}),
  });
}

function makeUpdateSchema(columns) {
  return z.object({
    body: z.object(
      columns.reduce((acc, c) => {
        acc[c] = z.any().optional();
        return acc;
      }, {})
    ).transform((val) => pick(val, columns)),
    params: z.object({ id: z.string().min(1) }),
    query: z.object({}),
  });
}

module.exports = { makeCreateSchema, makeUpdateSchema };
