const express = require("express");
const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-contollers");

const router = express.Router();

router.route("/add").post(addFeatureImage);
router.route("/get").get(getFeatureImages);

router.route("/delete/:id").delete(deleteFeatureImage);

module.exports = router;
