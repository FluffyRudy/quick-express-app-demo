const express = require("express");
const { resolve } = require("path");
const { userRouter } = require("./routers/userRouter.cjs");

const PORT = 3000;

const app = express();

app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Listening at http://127.0.0.1:${PORT}`);
});
