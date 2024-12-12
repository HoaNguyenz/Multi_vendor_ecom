const express = require("express");
const validations = require("../validations/user");
const controllers = require("../controllers/user");
const { verifyToken } = require("../middleware");

const userRouter = express.Router();

userRouter.use(verifyToken);

userRouter.get("/get-user-info/:username", controllers.getUserInfo);
userRouter.put("/update-user", controllers.updateUser);

userRouter.post("/cart", controllers.addToCart);
userRouter.delete("/cart", controllers.deleteFromCart);
userRouter.get("/cart", controllers.getCart);
userRouter.put("/cart", controllers.updateCart);

userRouter.post("/order", controllers.createOrder);
userRouter.delete("/order", controllers.cancelOrder);
userRouter.get("/order", controllers.getOrder);

// Thêm địa chỉ giao hàng cho người dùng
userRouter.post("/address", validations.addAddress, controllers.addAddress);
userRouter.get("/address", controllers.getAddress);
userRouter.put(
  "/address/:id",
  validations.updateAddress,
  controllers.updateAddress
);
userRouter.delete("/address/:id", controllers.deleteAddress);

userRouter.post("/review", controllers.addReview);
userRouter.get("/review/:maSanPham", controllers.getReview);

module.exports = userRouter;
