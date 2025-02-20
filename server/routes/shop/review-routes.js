const express = require("express");
const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controllers");

const router = express.Router();

router.route("/add").post(addProductReview);
router.route("/:productId").get(getProductReviews);

module.exports = router;
