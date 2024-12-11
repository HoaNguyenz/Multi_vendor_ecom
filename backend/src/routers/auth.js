const express = require("express");
// const validations = require("../validations/auth");
const controllers = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post("/sign-up", controllers.signUp);
authRouter.post("/verify", controllers.verify);
authRouter.post("/login", controllers.login);
authRouter.post("/isSeller", controllers.isSeller);
authRouter.get("/authenticate", controllers.authenticate);
authRouter.post("/forgot-password", controllers.forgotPassword);
authRouter.post("/reset-password", controllers.resetPassword);
authRouter.post("/logout", controllers.logout);

module.exports = authRouter;
