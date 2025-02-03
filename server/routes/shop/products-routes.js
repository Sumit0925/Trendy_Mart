const express = require("express");
const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controllers");

const router = express.Router();

router.route("/get").get(getFilteredProducts);
router.route("/get/:id").get(getProductDetails);

module.exports = router;
