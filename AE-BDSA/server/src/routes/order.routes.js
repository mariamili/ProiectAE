const express = require("express");
const prisma = require("../prisma");
const { getValidationErrors } = require("../utils/validateUtils");
const CreateOrderSchema = require("../dtos/order.dtos/createOrder.dto");

const router = express.Router();

router.post("/create", async (req, res) => {
  const validation = CreateOrderSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = getValidationErrors(validation);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: errors.join(", "), data: errors });
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User not found", data: {} });
  }
  


  // const order = await prisma.order.create({
  //   data: {
  //     userId: req.userId,
  //     ...validation.data,
  //     status: "PENDING",
  //   },
  // });

  // return res
  //   .status(200)
  //   .json({ success: true, message: "Order created", data: order });

  const orderData = {
    address: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    name: req.body.name,
    total: req.body.total,
    userId: req.userId,
    status: "PAYED",
    orderRows: {
      create: req.body.orderRows.map((row) => ({
        productName: row.productName,
        quantity: row.quantity,
        price: row.price,
      })),
    },
  };
  
  const order = await prisma.order.create({
    data: orderData,
    include: {
      orderRows: true, // Include the created OrderRows
    },
  });
  
  return res.status(201).json({
    success: true,
    message: "Order and OrderRows created successfully",
    data: order,
  });
});

const jwt = require("jsonwebtoken"); // Ensure jsonwebtoken is imported

router.get("/get", async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace JWT_SECRET with your secret key

    // Fetch orders for the decoded user
    const orders = await prisma.order.findMany({
      where: { userId: decoded.id }, // Use the id from the decoded token
      include: {
        orderRows: true, // Include OrderRow details
      },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});


module.exports = router;
