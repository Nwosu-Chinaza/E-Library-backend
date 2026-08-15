import { Router } from "express";

import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  showResetPasswordPage,
} from "../controllers/authController.js";
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

/**
 * @route GET /api/auth/verify-email/:token
 * @desc Verify user email
 * @access Public
 */
router.get(
  "/verify-email/:token",
  verifyEmail
);


/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post(
  "/forgot-password",
  forgotPassword
);

/**
 * @route GET /api/auth/reset-password/:token
 * @desc Display password reset page
 * @access Public
 */
router.get(
  "/reset-password/:token",
  showResetPasswordPage
);

/**
 * @route POST /api/auth/reset-password/:token
 * @desc Reset user password
 * @access Public
 */
router.post(
  "/reset-password/:token",
  resetPassword
);
export default router;