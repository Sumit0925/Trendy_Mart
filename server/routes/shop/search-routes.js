const express = require("express");
const { searchProducts } = require("../../controllers/shop/search-controllers");

const router = express.Router();

router.route("/:keyword").get(searchProducts);

module.exports = router;
