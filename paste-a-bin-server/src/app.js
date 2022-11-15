const express = require("express");
const app = express();
const port = 3001;

const pasteRouter = require("./route/paste");
const commentRouter = require("./route/comment");
const loginRouter = require("./route/login");
const hubRouter = require("./route/hub");

app.use(express.json());

app.use("/api/paste", pasteRouter);
app.use("/api/comment", commentRouter);
app.use("/api/login", loginRouter);
app.use("/api/hub", hubRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.send({
    success: false,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
