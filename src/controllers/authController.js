import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import env from "../config/env.js";
import { sendEmail } from "../services/emailService.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  findUserByEmail,
  findRoleByName,
  findUserWithRoleByEmail,
  createUser,
  verifyUserEmail,
  createPasswordResetToken,
  resetUserPassword,
} from "../services/authService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Get default user role
    const role = await findRoleByName("User");

    if (!role) {
      return res.status(500).json({
        success: false,
        message: "Default role not found.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with verification token
    const newUser = await createUser({
      role_id: role.id,
      full_name,
      email,
      password: hashedPassword,
      profile_image_url: null,
    });

    // Create email verification link
    const verificationLink = `${env.APP_URL}/api/auth/verify-email/${newUser.verification_token}`;

    // Send verification email
    await sendEmail({
      to: email,
      subject: "Verify your E-Library account",
      html: `
                <h2>Welcome to E-Library, ${full_name}!</h2>

                <p>
                    Thank you for creating an account.
                    Please verify your email address by clicking the button below.
                </p>

                <p>
                    <a href="${verificationLink}">
                        Verify Email
                    </a>
                </p>

                <p>
                    This verification link will expire in 24 hours.
                </p>
            `,
    });

    // Generate JWT
    const token = generateToken({
      id: newUser.id,
      role: role.name,
    });

    // Remove sensitive verification data
    const {
      password: _,
      verification_token: __,
      verification_token_expires: ___,
      ...safeUser
    } = newUser;

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      token,
      user: {
        ...safeUser,
        role: role.name,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @desc Verify user email
 * @route GET /api/auth/verify-email/:token
 * @access Public
 */
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Verify the token
        const user = await verifyUserEmail(token);

        if (!user) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Verification Failed | E-Library</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                    <h1>❌ Verification Failed</h1>
                    <p>This verification link is invalid or has expired.</p>
                </body>
                </html>
            `);
        }

        // Locate the HTML file
        const htmlPath = path.join(
            __dirname,
            "../views/emailVerified.html"
        );

        // Read the HTML file
        let html = await fs.readFile(htmlPath, "utf-8");

        // Replace the frontend URL placeholder
        html = html.replace(
            "{{FRONTEND_URL}}",
            env.FRONTEND_URL
        );

        // Send HTML page
        return res.status(200).send(html);

    } catch (error) {
        console.error("Verify Email Error:", error);

        return res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error | E-Library</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <h1>Something went wrong.</h1>
                <p>Please try again later.</p>
            </body>
            </html>
        `);
    }
};


/**
 * @desc Request password reset
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await findUserByEmail(email);

        // Don't reveal whether an email exists
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account with that email exists, a password reset link has been sent.",
            });
        }

        // Generate reset token
        const resetUser = await createPasswordResetToken(email);

        const resetLink =
            `${env.APP_URL}/api/auth/reset-password/${resetUser.reset_token}`;

        // Send reset email
        await sendEmail({
            to: email,
            subject: "Reset your E-Library password",
            html: `
                <h2>Password Reset</h2>

                <p>Hello ${user.full_name},</p>

                <p>
                    We received a request to reset your E-Library password.
                </p>

                <p>
                    <a href="${resetLink}">
                        Reset Password
                    </a>
                </p>

                <p>
                    This link will expire in 1 hour.
                </p>

                <p>
                    If you did not request this, you can safely ignore this email.
                </p>
            `,
        });

        return res.status(200).json({
            success: true,
            message:
                "If an account with that email exists, a password reset link has been sent.",
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};


/**
 * @desc Reset user password
 * @route POST /api/auth/reset-password/:token
 * @access Public
 */
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirm_password } = req.body;

        // Check passwords match
        if (password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Reset password
        const user = await resetUserPassword(
            token,
            hashedPassword
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset link.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};


/**
 * @desc Display password reset page
 * @route GET /api/auth/reset-password/:token
 * @access Public
 */
export const showResetPasswordPage = async (req, res) => {
    try {
        const htmlPath = path.join(
            __dirname,
            "../views/resetPassword.html"
        );

        const html = await fs.readFile(
            htmlPath,
            "utf-8"
        );

        return res.status(200).send(html);

    } catch (error) {
        console.error(
            "Reset Password Page Error:",
            error
        );

        return res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error | E-Library</title>
            </head>
            <body>
                <h1>Something went wrong.</h1>
                <p>Please try again later.</p>
            </body>
            </html>
        `);
    }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with role
        const user = await findUserWithRoleByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Generate JWT
        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        // Remove password before sending response
      const { password: _, ...safeUser } = user;

return res.status(200).json({
  success: true,
  message: "Login successful.",
  token,
  user: safeUser,
});

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};