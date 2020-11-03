const express = require("express");
// const express_validator = require('express-validator');
// const path = require('path');

const connectDb = require("./config/db");
const bodyParser = require('body-parser');

const app = express();
connectDb();

const port = process.env.PORT || 5000;
// In case Port is busy
// process.on("unhandledRejection", (err) => {
//   if (err) throw err;
// });
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(express.json({
    extended: false
}));


// app.use("/api/users", require("./routes/api/users_backup"));
app.use("/api/users", require("./routes/api/users"));

app.use("/api/auth", require("./routes/api/auth"));

app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.get("/", (req, res) => res.send("Welcome"));

app.listen(port, (err) => {
  if (err) {
    // console.log(error);
    throw err;
  }
});