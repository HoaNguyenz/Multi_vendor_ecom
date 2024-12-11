const express = require("express");
// const validations = require("../validations/user");
const controllers = require("../controllers/user");

const userRouter = express.Router();

userRouter.get("/get-user-info/:username", controllers.getUserInfo);
userRouter.put("/update-user", controllers.updateUser);

userRouter.post("/cart/", controllers.addToCart);
userRouter.delete("/cart/", controllers.deleteFromCart);
userRouter.get("/cart", controllers.getCart);
userRouter.put("/cart", controllers.updateCart);

userRouter.post("/order", controllers.createOrder);
userRouter.delete("/order", controllers.cancelOrder);
userRouter.get("/order", controllers.getOrder);

module.exports = userRouter;
