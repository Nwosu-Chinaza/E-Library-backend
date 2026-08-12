import { getDashboardStats } from "../services/dashboardService.js";

/**
 * @desc Get admin dashboard statistics
 * @route GET /api/dashboard/stats
 * @access Admin
 */
export const getDashboardStatsController = async (req, res) => {
  try {
    const stats = await getDashboardStats();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
};
