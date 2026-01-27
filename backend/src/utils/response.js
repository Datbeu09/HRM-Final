module.exports = {
  ok(res, data = null, message = "OK") {
    return res.json({ success: true, message, data });
  },
  created(res, data = null, message = "CREATED") {
    return res.status(201).json({ success: true, message, data });
  },
};
