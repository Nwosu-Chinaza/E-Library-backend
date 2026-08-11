import { getBookFiles } from "../services/bookFileService.js";
import { incrementDownloadCount } from "../services/bookService.js";

/**
 * @desc Download a book
 * @route GET /api/books/:id/download
 * @access Authenticated Users
 */
export const downloadBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the book's file
    const files = await getBookFiles(id);

    if (!files) {
      return res.status(404).json({
        success: false,
        message: "Book file not found.",
      });
    }

    // Make sure a document exists
    if (!files.file_url) {
      return res.status(404).json({
        success: false,
        message: "Book document is not available.",
      });
    }

    // Increase download count
    const updatedBook = await incrementDownloadCount(id);

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book ready for download.",
      download_count: updatedBook.download_count,
      file_url: files.file_url,
    });
  } catch (error) {
    console.error("Download Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download book.",
    });
  }
};
