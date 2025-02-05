const Cart = require("../../models/cart-model");
const Product = require("../../models/product-model");

//* Add To Cart Logic
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data Provided",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex((item) => {
      return item.productId.toString() === productId;
    });

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    
    return res.status(200).json({
      success: true,
      data: cart,
      message: "Item Added Successfully!",
    });
  } catch (error) {
    console.log(error),
      res.status(500).json({
        success: false,
        message: "Error Occured in AddToCart",
      });
  }
};

//* Fetching the cart Logic

const FetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is mandatory!",
      });
    }

    // Fetch cart WITHOUT using .lean() → Returns a Mongoose document
    //* The .populate() method replaces the productId in items with actual product details
    //* from the Product collection:image, title, price, salePrice;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Filter out invalid items
    const validItems = cart.items.filter((item) => item.productId);

    // If invalid items exist, update and save the cart
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save(); // Need to save because .lean() is NOT used
    }

    // Format the response -> This ensures only necessary data is sent in the response.
    const formattedItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc, // (_.doc)-> Extracts raw document data(excluding methods)
        items: formattedItems,
      },
    });
  } catch (error) {
    console.log("Fetching Cart Items Error", error);
    return res.status(500).json({
      success: false,
      messge: "Error Occured in FetchCartItems",
    });
  }
};

//* Update Cart Item Quantity Logic

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    //* Find the cart and update the quantity ->(1st way)

    // const cart = await Cart.findOne({ userId });
    // if (!cart) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Cart not found!",
    //   });
    // }

    // const findCurrentProductIndex = cart.items.findIndex(
    //   (item) => item.productId.toString() === productId
    // );

    // if (findCurrentProductIndex === -1) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Cart item not present !",
    //   });
    // }

    // cart.items[findCurrentProductIndex].quantity = quantity;
    // await cart.save();

    // await cart.populate({
    //   path: "items.productId",
    //   select: "image title price salePrice",
    // });

    //* Find the cart and update the quantity in a single step

    const cart = await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $set: { "items.$.quantity": quantity } },
      { new: true } // Ensures the updated document is returned
    ).populate("items.productId", "image title price salePrice");

    // If cart or item not found
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart or product not found!" });
    }

    // Transform cart items for response
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
      message: "Quantity Updated Successfully!",
    });
  } catch (error) {
    console.log("Update Cart Item Quantity Error", error);
    res.status(500).json({
      success: false,
      message: "",
    });
  }
};

//* Deleting Cart Item Logic

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided!" });
    }

    // Find the cart and update it by removing the item
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } }, // `$pull` removes the matching productId from items array
      { new: true } // Return the updated document
    ).populate("items.productId", "image title price salePrice");

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found!" });
    }

    // Transform cart items for response
    const populatedCartItems = cart.items.map(({ productId, quantity }) => ({
      productId: productId ? productId._id : null,
      image: productId ? productId.image : null,
      title: productId ? productId.title : "Product not found",
      price: productId ? productId.price : null,
      salePrice: productId ? productId.salePrice : null,
      quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addToCart,
  FetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};
