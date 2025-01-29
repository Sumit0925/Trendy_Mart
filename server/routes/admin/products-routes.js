const express = require("express");
const { upload } = require("../../helpers/cloudinary");
const {
  handleImageUpload,
  addProduct,
  editProduct,
  deleteProduct,
  fetchAllProducts,
} = require("../../controllers/admin/products-controllers");

const router = express.Router();

router.route("/upload-image").post(upload.single("my_file"), handleImageUpload);
router.route("/add").post(addProduct);
router.route("/edit/:id").put(editProduct);
router.route("/delete/:id").delete(deleteProduct);
router.route("/get").get(fetchAllProducts);

module.exports = router;
