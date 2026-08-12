import bcrypt from "bcryptjs";

import {
  getUserById,
  updateUserProfile,
  getUserPassword,
  updateUserPassword,
} from "../services/userService.js";

/**
 * @desc Get current user's profile
 * @route GET /api/users/profile
 * @access Authenticated Users
 */
export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

/**
 * @desc Update current user's profile
 * @route PUT /api/users/profile
 * @access Authenticated Users
 */
export const updateProfile = async (req, res) => {
  try {
    const { full_name, email } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required.",
      });
    }

    const user = await updateUserProfile(req.user.id, {
      full_name,
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    // PostgreSQL unique constraint violation
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email address is already in use.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

/**
 * @desc Change current user's password
 * @route PUT /api/users/password
 * @access Authenticated Users
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await getUserPassword(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateUserPassword(req.user.id, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};
