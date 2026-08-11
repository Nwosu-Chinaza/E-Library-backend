import {
  recordReadingHistory,
  getReadingHistoryByUser,
  updateLastPage,
} from "../services/readingHistoryService.js";

/**
 * @desc Record that a user opened a book
 * @route POST /api/books/:id/read
 * @access Authenticated Users
 */
export const recordBookRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const history = await recordReadingHistory(userId, id);

    return res.status(200).json({
      success: true,
      message: "Reading history recorded.",
      history,
    });
  } catch (error) {
    console.error("Record Reading History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record reading history.",
    });
  }
};

/**
 * @desc Get the logged-in user's reading history
 * @route GET /api/books/history
 * @access Authenticated Users
 */
export const getMyReadingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await getReadingHistoryByUser(userId);

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Get Reading History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reading history.",
    });
  }
};


/**
 * @desc Update the last page read
 * @route PUT /api/books/:id/read
 * @access Authenticated Users
 */
export const updateBookProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { last_page } = req.body;
    const userId = req.user.id;

    if (!last_page || Number(last_page) < 1) {
      return res.status(400).json({
        success: false,
        message: "A valid last page is required.",
      });
    }

    const history = await updateLastPage(
      userId,
      id,
      Number(last_page)
    );

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Reading history not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reading progress updated.",
      history,
    });
  } catch (error) {
    console.error("Update Reading Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update reading progress.",
    });
  }
};