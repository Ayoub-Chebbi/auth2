const mongoose = require("mongoose");
mongoose
  .connect(`mongodb://127.0.0.1:27017/TestUser2`)
  .then(() => console.log("connected"))
  .catch((err) => console.log("not connected", err));