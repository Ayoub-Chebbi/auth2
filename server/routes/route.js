const User = require("../controllers/controllers")

module.exports = (app) => {
    app.post("/register",User.CreateUser);
    app.post("/login",User.LoginUser);
    app.get("/logout" , User.LogoutUser);
};