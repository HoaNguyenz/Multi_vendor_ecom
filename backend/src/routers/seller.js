const express = require("express");
// const validations = require("../validations/seller");
const controllers = require("../controllers/seller");

const sellerRouter = express.Router();

sellerRouter.post("/sign-up-seller", controllers.signUpSeller);
sellerRouter.get("/seller-info", controllers.getSellerInfo);
sellerRouter.put("/update-shop", controllers.updateShop);

sellerRouter.get("/seller/orders", controllers.getOrders);
sellerRouter.put("/confirm-order/:id", controllers.confirmOrder);
sellerRouter.put("/confirm-delivery/:id", controllers.confirmDelivery);

module.exports = sellerRouter;
