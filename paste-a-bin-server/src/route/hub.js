const { getHubPastes } = require("../service/pasteService");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const user = req.header("user");
    const data = await getHubPastes(user);
    res.send({
      success: true,
      data,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
