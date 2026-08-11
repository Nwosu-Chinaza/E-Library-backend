import { Router } from "express";

import { getBookFilesController } from "../controllers/bookFileController.js";

const router = Router();

/**
 * @route GET /api/books/:id/files
 * @desc Get files belonging to a book
 * @access Public
 */
router.get("/:id/files", getBookFilesController);

export default router;
