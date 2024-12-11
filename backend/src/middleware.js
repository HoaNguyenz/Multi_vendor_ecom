const jwt = require("jsonwebtoken");
const StatusCodes = require("http-status-codes").StatusCodes;
require("dotenv").config();

const jwtBlacklist = new Set();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  if (!token || jwtBlacklist.has(token)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Bạn cần đăng nhập để thực hiện chức năng này." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

// Export middleware và các tiện ích liên quan
module.exports = {
  verifyToken,
  jwtBlacklist,
};
