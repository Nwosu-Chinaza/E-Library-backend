import { Router } from "express";

import { readBook } from "../controllers/readingController.js";
import protect from "../middleware/auth.js";

const router = Router();

/**
 * @route GET /api/books/:id/read
 * @desc Get a book for reading
 * @access Authenticated Users
 */
router.get("/:id/read", protect, readBook);

export default router;