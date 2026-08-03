import { Router } from "express";

import { register, login } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  "/register",
  registerValidator,
  validate,
  register
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  "/login",
  loginValidator,
  validate,
  login
);

export default router;