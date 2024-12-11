const express = require("express");
const authRouter = require("./auth.js");
const userRouter = require("./user.js");
const sellerRouter = require("./seller.js");
const productRouter = require("./product.js");

const router = express.Router();

router.use(authRouter);
router.use(userRouter);
router.use(sellerRouter);
router.use(productRouter);

module.exports = router;
