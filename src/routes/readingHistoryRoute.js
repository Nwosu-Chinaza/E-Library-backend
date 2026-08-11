import { Router } from "express";

import {
  recordBookRead,
  getMyReadingHistory,
  updateBookProgress,
} from "../controllers/readingHistoryController.js";

import protect from "../middleware/auth.js";

const router = Router();



/**
 * @route GET /api/books/history
 * @desc Get the logged-in user's reading history
 * @access Authenticated Users
 */
router.get("/history", protect, getMyReadingHistory);

router.put("/:id/read", protect, updateBookProgress);
/**
 * @route POST /api/books/:id/read
 * @desc Record that the user opened a book
 * @access Authenticated Users
 */
router.post("/:id/read", protect, recordBookRead);
export default router;
