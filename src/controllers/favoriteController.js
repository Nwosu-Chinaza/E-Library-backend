import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
} from "../services/favoriteService.js";

/**
 * @desc Add a book to favorites
 * @route POST /api/books/:id/favorite
 * @access Authenticated Users
 */
export const addBookToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favorite = await addFavorite(userId, id);

    if (!favorite) {
      return res.status(200).json({
        success: true,
        message: "Book is already in your favorites.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Book added to favorites.",
      favorite,
    });
  } catch (error) {
    console.error("Add Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add book to favorites.",
    });
  }
};

/**
 * @desc Remove a book from favorites
 * @route DELETE /api/books/:id/favorite
 * @access Authenticated Users
 */
export const removeBookFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favorite = await removeFavorite(userId, id);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Book is not in your favorites.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book removed from favorites.",
      favorite,
    });
  } catch (error) {
    console.error("Remove Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove book from favorites.",
    });
  }
};

/**
 * @desc Get logged-in user's favorite books
 * @route GET /api/books/favorites
 * @access Authenticated Users
 */
export const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await getFavoritesByUser(userId);

    return res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    console.error("Get Favorites Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorites.",
    });
  }
};
