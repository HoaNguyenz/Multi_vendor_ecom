const express = require("express");
// const validations = require("../validations/seller");
const controllers = require("../controllers/seller");
const { verifyToken } = require("../middleware");

const sellerRouter = express.Router();

sellerRouter.use(verifyToken);
sellerRouter.post("/sign-up-seller", controllers.signUpSeller);
sellerRouter.get("/seller-info", controllers.getSellerInfo);
sellerRouter.put("/update-shop", controllers.updateShop);

module.exports = sellerRouter;
