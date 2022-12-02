const {
  createPaste,
  getPaste,
  updatePaste,
  deletePaste,
} = require("../service/pasteService");
// I particularly like how your doing named imports for
// your DB functions. I'll look to use that in my code more!

const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const pasteId = await createPaste(req.body);
    res.send({
      success: true,
      data: {
        pasteId,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:pasteId", async (req, res, next) => {
  try {
    const user = req.header("user");
    const sharePassword = req.header("sharePassword");
    const result = await getPaste(req.params.pasteId, user, sharePassword);
    const success = !result.error;
    res.send({
      success,
      data: result,
    });
  } catch (e) {
    next(e);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const paste = await updatePaste(req.body);
    res.send({
      success: true,
      data: paste,
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:pasteId", async (req, res, next) => {
  try {
    await deletePaste(req.params.pasteId);
    res.send({
      success: true,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

// Not sure what next(e) does, however this is a good file.
// Made a comment up at the beginning about the named imports for
// the database functions which were nice to see.
// I'm sure the professor would have called out using "require" vs "import ... from ..."
// so I'll call that out too lol. Good job nonetheless!
