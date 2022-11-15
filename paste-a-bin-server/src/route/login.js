const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    res.send({
      success: true,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
