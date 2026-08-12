import { Router } from "express";

import {
  addBookToFavorites,
  removeBookFromFavorites,
  getMyFavorites,
} from "../controllers/favoriteController.js";

import protect from "../middleware/auth.js";

const router = Router();

/**
 * @route GET /api/books/favorites
 * @desc Get logged-in user's favorite books
 * @access Authenticated Users
 */
router.get("/favorites", protect, getMyFavorites);

/**
 * @route POST /api/books/:id/favorite
 * @desc Add a book to favorites
 * @access Authenticated Users
 */
router.post("/:id/favorite", protect, addBookToFavorites);

/**
 * @route DELETE /api/books/:id/favorite
 * @desc Remove a book from favorites
 * @access Authenticated Users
 */
router.delete("/:id/favorite", protect, removeBookFromFavorites);

export default router;
