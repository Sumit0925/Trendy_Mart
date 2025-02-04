const express = require("express");
const {
  addToCart,
  FetchCartItems,
  updateCartItemQty,
  deleteCartItem,
} = require("../../controllers/shop/cart-controllers");

const router = express.Router();

router.route("/add").post(addToCart);
router.route("/get/:userId").get(FetchCartItems);
router.route("/update-cart").put(updateCartItemQty);
router.route("/delete/:userId/:productId").delete(deleteCartItem);

module.exports = router;
