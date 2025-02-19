const express = require("express");
const { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails } = require("../../controllers/shop/order-controllers");

const router = express.Router();

router.route("/create").post(createOrder);
router.route("/capture").post(capturePayment);
router.route("/list/:userId").get(getAllOrdersByUser);
router.route("/details/:id").get(getOrderDetails);

module.exports = router;
