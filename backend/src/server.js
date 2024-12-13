const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const exitHook = require("async-exit-hook");
require("dotenv").config();

const { connectDB, sql } = require("./db");
const router = require("./routers/index");

function runServer() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true })); // Tăng giới hạn form data
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:3000", // URL của React app
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(router);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`)
  );

  exitHook(async function () {
    console.log("SQL Server connection closed");
    await sql.close();
  });
}

(async function () {
  try {
    await connectDB();
    runServer();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
