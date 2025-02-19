const Product = require("../../models/product-model");


//^ Global Search Products Logic

const searchProducts = async (req, res) => {
  try {
    // const keyword = req.params.keyword?.trim();

    const { keyword } = req.params;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be string",
      });
    }

    //* Case-insensitive regex search
    // const regEx = new RegExp(keyword, "i");

    //* Construct search query
    // const searchQuery = {
    //   $or: [
    //     { title: regEx },
    //     { description: regEx },
    //     { category: regEx },
    //     { brand: regEx },
    //   ],
    // };

    //^ Combined query and case-insensitive regex;
    const searchQuery = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
      ],
    };

    //* Pagination (default: page 1, limit 10 results per page)
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const skip = (page - 1) * limit;

    //* Fetch results with pagination
    const searchResults = await Product.find(searchQuery)
    //   .skip(skip)
    //   .limit(limit);

    //* Handle no results found
    if (!searchResults.length) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    // Send response
    res.status(200).json({
      success: true,
      data: searchResults,
      //   page,
      //   limit,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { searchProducts };
