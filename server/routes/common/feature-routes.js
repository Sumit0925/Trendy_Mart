const express = require("express");
const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controllers/common/feature-contollers");

const router = express.Router();

router.route("/add").post(addFeatureImage);
router.route("/get").get(getFeatureImages);

module.exports = router;
