const express = require("express");
const { upload } = require("../../helpers/cloudinary");
const {
  handleImageUpload,
} = require("../../controllers/admin/products-controllers");

const router = express.Router();

router.route("/upload-image").post(upload.single("my_file"), handleImageUpload);

module.exports = router;
