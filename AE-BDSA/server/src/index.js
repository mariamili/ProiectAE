const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const { verifyToken } = require("./utils/tokenUtils");
const paymentRoutes = require("./routes/payment.routes");



const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(
  cors(),
  //   {
  //   origin: "http://127.0.0.1:5173",
  // }
);

// Register routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/orders", verifyToken, orderRoutes);
app.use("/payments", paymentRoutes);

// Test root endpoint
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
