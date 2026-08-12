import { Router } from "express";

import { getDashboardStatsController } from "../controllers/dashboardController.js";

import protect from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = Router();

/**
 * @route GET /api/dashboard/stats
 * @desc Get admin dashboard statistics
 * @access Admin
 */
router.get("/stats", protect, admin, getDashboardStatsController);

export default router;
