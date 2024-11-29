const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SnowflakeId } = require("@akashrajpurohit/snowflake-id");

const jwtBlacklist = new Set();
const workerId = process.pid % 1024;
const snowflake = SnowflakeId({ workerId });

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  if (!token || jwtBlacklist.has(token)) {
    return res
      .status(401)
      .json({ message: "Bạn cần đăng nhập để thực hiện chức năng này." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

// Export middleware và các tiện ích liên quan
module.exports = {
  verifyToken,
  jwtBlacklist,
  snowflake
};
