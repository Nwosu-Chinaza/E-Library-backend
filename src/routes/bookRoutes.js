import { validateBook } from "../validators/bookValidator.js";
import { Router } from "express";

import {
  getBooks,
  getBook,
  addBook,
  editBook,
  removeBook,
} from "../controllers/bookController.js";
import protect from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

/**
 * @route GET /api/books
 * @desc Get all books or search books
 * @access Public
 */
router.get("/", getBooks);

/**
 * @route GET /api/books/:id
 * @desc Get a single book
 * @access Public
 */
router.get("/:id", getBook);

/**
 * @route POST /api/books
 * @desc Upload a new book
 * @access Authenticated Users
 */
router.post(
  "/",
  protect,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  validateBook,
  addBook,
);

/**
 * @route PUT /api/books/:id
 * @desc Update a book
 * @access Owner or Admin
 */
router.put("/:id", protect, editBook);

/**
 * @route DELETE /api/books/:id
 * @desc Delete a book
 * @access Owner or Admin
 */
router.delete("/:id", protect, removeBook);

export default router;
