const { z } = require("zod");

const OrderRowSchema = z.object({
  productName: z.string(),
  quantity: z.number().int().positive(), // Quantity must be a positive integer
  price: z.number().positive(),          // Price must be a positive number
});

const CreateOrderSchema = z.object({
  name: z.string(),
  phone: z.string(),
  city: z.string(),
  address: z.string(),
  total: z.number(),
  orderRows: z.array(OrderRowSchema),    // Validates an array of OrderRow objects
});

module.exports = CreateOrderSchema;

