const express = require("express");
const prisma = require("../prisma");
const LoginSchema = require("../dtos/auth.dtos/login.dto");
const CheckTokenSchema = require("../dtos/auth.dtos/checkToken.dto");
const { comparePassword } = require("../utils/bcryptUtils");
const { generateToken, isValidToken } = require("../utils/tokenUtils");
const { getValidationErrors } = require("../utils/validateUtils");

const router = express.Router();

router.post("/login", async (req, res) => {
  const validation = LoginSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = getValidationErrors(validation);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: errors.join(", "), data: errors });
    }
  }

  const user = await prisma.user.findFirst({
    where: {
      email: validation.data.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      password:true // Ensure this matches the database column
    },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials", data: {} });
  }

  const validPassword = comparePassword(
    validation.data.password,
    user.password,
  );

  if (!user || !validPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials", data: {} });
  }

  const token = generateToken(user.id);

  return res.status(200).json({
    success: true,
    message: "User logged in",
    data: {
      token,
      email: user.email,
      name: user.name,
      dateJoined: user.createdAt, // Assuming 'createdAt' is the date the user joined
    }});
  
});

router.post("/check", async (req, res) => {
  const validation = CheckTokenSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = getValidationErrors(validation);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: errors.join(", "), data: errors });
    }
  }

  const validToken = isValidToken(validation.data.token);

  if (!validToken) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid token", data: {} });
  }

  //alert(user.email);
// Return user details along with the token
return res.status(200).json({
  success: true,
  message: "User logged in",
  data: {
    token,
    email: user.email,
    name: user.name,
    dateJoined: user.created_at, // Assuming 'createdAt' is the date the user joined
  }});

  // return res
  //   .status(200)
  //   .json({ success: true, message: "Token is valid", data: {} });
});

module.exports = router;
