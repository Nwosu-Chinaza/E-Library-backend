import { getBookForReading } from "../services/readingService.js";

/**
 * @desc Get a book for reading
 * @route GET /api/books/:id/read
 * @access Authenticated Users
 */
export const readBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await getBookForReading(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found or file unavailable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book ready for reading.",
      book,
    });
  } catch (error) {
    console.error("Read Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load book for reading.",
    });
  }
};
