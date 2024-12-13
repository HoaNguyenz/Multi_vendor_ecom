const express = require("express");
// const validations = require("../validations/product");
const controllers = require("../controllers/product");
const { verifyToken } = require("../middleware");
const productRouter = express.Router();

productRouter.post("/add-category", controllers.addCategory);
productRouter.get("/get-categories", controllers.getCategories);

productRouter.get("/filter-options", controllers.getFilterOptions);

productRouter.post("/add-product", verifyToken, controllers.addProduct);
productRouter.delete("/delete-product/:id", verifyToken, controllers.deleteProduct);
productRouter.put("/edit-product/:id", verifyToken, controllers.updateProduct);

productRouter.get("/search-products", controllers.searchProducts);

productRouter.get("/search-productsbyBao", controllers.searchProductsbyBao);

productRouter.get("/products-by-category", controllers.getProductsByCategory);
// search products by seller
productRouter.get(
  "/seller/search-products",
  controllers.searchProductsBySeller
);

productRouter.get("/product-detail/:id", controllers.getDetailProduct);
productRouter.get("/best-selling-products", controllers.getBestSellingProducts);
productRouter.get("/product-seller", verifyToken, controllers.getProductSeller);

module.exports = productRouter;
