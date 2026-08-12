import { Router } from "express";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

import protect from "../middleware/auth.js";

const router = Router();

/**
 * @route GET /api/users/profile
 * @desc Get current user's profile
 * @access Authenticated Users
 */
router.get("/profile", protect, getProfile);

/**
 * @route PUT /api/users/profile
 * @desc Update current user's profile
 * @access Authenticated Users
 */
router.put("/profile", protect, updateProfile);

/**
 * @route PUT /api/users/password
 * @desc Change current user's password
 * @access Authenticated Users
 */
router.put("/password", protect, changePassword);

export default router;
