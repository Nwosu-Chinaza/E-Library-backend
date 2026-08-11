import { getBookFiles } from "../services/bookFileService.js";

/**
 * @desc Get files belonging to a book
 * @route GET /api/books/:id/files
 * @access Public
 */
export const getBookFilesController = async (req, res) => {
  try {
    const { id } = req.params;

    const files = await getBookFiles(id);

    if (!files) {
      return res.status(404).json({
        success: false,
        message: "Book files not found.",
      });
    }

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("Get Book Files Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book files.",
    });
  }
};
