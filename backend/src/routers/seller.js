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
sellerRouter.get("/get-status", verifyToken, controllers.getStatus);
sellerRouter.get("/sales-summary", verifyToken, controllers.salesSummary);
sellerRouter.get("/orders-completed", verifyToken, controllers.getCompletedOrders);
sellerRouter.get("/product-rank", verifyToken, controllers.getProductRank);
sellerRouter.get("/shop-rating", verifyToken, controllers.getRatings);
sellerRouter.get("/out-of-stock", verifyToken, controllers.getOutOfStockProducts);

module.exports = sellerRouter;
