const express = require("express");
const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controllers");

const router = express.Router();

router.route("/add").post(addAddress);
router.route("/get/:userId").get(fetchAllAddress);
router.route("/update/:userId/:addressId").put(editAddress);
router.route("/delete/:userId/:addressId").delete(deleteAddress);

module.exports = router;
