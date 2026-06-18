import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const registerInfoValidation = [
  body("email").isEmail().withMessage("Invalid email"),

  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3-20 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, underscores"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginInfoValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").exists().withMessage("Password required"),
];

export const handleBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};
