const express = require("express");
const app = express();
const cors = require("cors");
const session = require('express-session');
const bodyparser = require("body-parser");

app.use(
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  bodyparser.json(),
  session({
    secret: '1234',
    resave: false,
    saveUninitialized: true
  })
);
require("dotenv").config();
require("./config/config");
require("./routes/route")(app);

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
