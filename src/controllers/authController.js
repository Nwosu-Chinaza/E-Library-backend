import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

import {
    findUserByEmail,
    findRoleByName,
    findUserWithRoleByEmail,
    createUser,
} from "../services/authService.js";

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

        // Create user
        const newUser = await createUser({
            role_id: role.id,
            full_name,
            email,
            password: hashedPassword,
            profile_image_url: null,
        });

        // Generate JWT
        const token = generateToken({
            id: newUser.id,
            role: role.name,
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            token,
            user: {
                ...newUser,
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