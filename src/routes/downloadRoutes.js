import { Router } from "express";

import { downloadBook } from "../controllers/downloadController.js";
import protect from "../middleware/auth.js";

const router = Router();

/**
 * @route GET /api/books/:id/download
 * @desc Download a book
 * @access Authenticated Users
 */
router.get("/:id/download", protect, downloadBook);

export default router;
