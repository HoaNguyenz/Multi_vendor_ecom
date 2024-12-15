const express = require("express");
const validations = require("../validations/user");
const controllers = require("../controllers/user");
const { verifyToken } = require("../middleware");

const userRouter = express.Router();

userRouter.get("/get-user-info/:username", verifyToken, controllers.getUserInfo);
userRouter.put("/update-user", verifyToken, controllers.updateUser);

userRouter.post("/cart", verifyToken, controllers.addToCart);
userRouter.delete("/cart", verifyToken, controllers.deleteFromCart);
userRouter.get("/cart", verifyToken, controllers.getCart);
userRouter.put("/cart", verifyToken, controllers.updateCart);

userRouter.post("/order", verifyToken, controllers.createOrder);
userRouter.delete("/order", verifyToken, controllers.cancelOrder);
userRouter.get("/order", verifyToken, controllers.getOrder);

// Thêm địa chỉ giao hàng cho người dùng
userRouter.post("/address", verifyToken, validations.addAddress, controllers.addAddress);
userRouter.get("/address", verifyToken, controllers.getAddress);
userRouter.put(
  "/address/:id",
  verifyToken,
  validations.updateAddress,
  controllers.updateAddress
);
userRouter.delete("/address/:id", verifyToken, controllers.deleteAddress);

userRouter.post("/review", verifyToken, controllers.addReview);
userRouter.get("/review/:maSanPham", controllers.getReview);

userRouter.get('/order/details/:maDonHang', verifyToken, controllers.productInOrder)

module.exports = userRouter;
