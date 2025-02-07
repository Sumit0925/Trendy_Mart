const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; //* Get token from cookies
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, Invalid Token" });
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY); //* Decode JWT
    req.user = verifiedUser; //* Attach user info to req.user
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, Invalid Token" });
  }
};

module.exports = { authMiddleware };
