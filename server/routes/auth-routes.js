const express = require("express");
const { register, login, logout } = require("../controllers/auth-controllers");
const { authMiddleware } = require("../middlewares/auth-middleware");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/check-auth").get(authMiddleware, (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json({ success: true, message: "Authenticated User", user });
});

module.exports = router;
