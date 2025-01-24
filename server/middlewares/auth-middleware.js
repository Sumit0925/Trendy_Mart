const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, Invalid Token" });
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verifiedUser;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, Invalid Token" });
  }
};

module.exports = { authMiddleware };
