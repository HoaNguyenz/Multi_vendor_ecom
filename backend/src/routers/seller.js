const express = require("express");
// const validations = require("../validations/seller");
const controllers = require("../controllers/seller");
const { verifyToken } = require("../middleware");

const sellerRouter = express.Router();

sellerRouter.post("/sign-up-seller", verifyToken, controllers.signUpSeller);
sellerRouter.get("/seller-info", verifyToken, controllers.getSellerInfo);
sellerRouter.put("/update-shop", verifyToken, controllers.updateShop);

sellerRouter.get("/seller/orders", verifyToken, controllers.getOrders);
sellerRouter.put("/confirm-order/:id", verifyToken, controllers.confirmOrder);
sellerRouter.put("/confirm-delivery/:id", verifyToken, controllers.confirmDelivery);

module.exports = sellerRouter;
