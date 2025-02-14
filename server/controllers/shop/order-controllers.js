const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../../models/order-model");
const Cart = require("../../models/cart-model");
const Product = require("../../models/product-model");

//* Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

//* Create an order in Razorpay
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    } = req.body;

    if (!userId || !cartId || !cartItems.length || !totalAmount) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    const newlyCreatedOrder = new Order({
      userId,
      userName,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "Pending",
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: razorpayOrder.id,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      razorpayOrder,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while creating the order!",
    });
  }
};

// Capture and verify payment
const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId, razorpaySignature } = req.body;

    let order = await Order.findOne({ paymentId: orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Update order status
    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.payerId = paymentId;

    // Reduce product stock
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // Delete cart after successful payment
    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while capturing payment!",
    });
  }
};

// Get all orders for a user
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get order details by order ID
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
