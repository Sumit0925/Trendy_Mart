const express = require("express");
const {
  getFilteredProducts,
} = require("../../controllers/shop/products-controllers");

const router = express.Router();

router.route("/get").get(getFilteredProducts);

module.exports = router;
