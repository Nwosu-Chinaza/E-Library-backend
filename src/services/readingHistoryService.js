import pool from "../config/db.js";

/**
 * Record or update a user's reading history.
 */
export const recordReadingHistory = async (userId, bookId) => {
  const query = `
    INSERT INTO reading_history (
      user_id,
      book_id
    )
    VALUES ($1, $2)

    ON CONFLICT (user_id, book_id)
    DO UPDATE SET
      last_read_at = CURRENT_TIMESTAMP

    RETURNING
      id,
      user_id,
      book_id,
      last_page,
      last_read_at;
  `;

  const { rows } = await pool.query(query, [userId, bookId]);

  return rows[0];
};

/**
 * Get a user's reading history.
 */
export const getReadingHistoryByUser = async (userId) => {
  const query = `
    SELECT
      reading_history.id,
      reading_history.book_id,
      reading_history.last_page,
      reading_history.last_read_at,

      books.title,
      books.author,

      book_files.cover_image_url

    FROM reading_history

    INNER JOIN books
      ON reading_history.book_id = books.id

    LEFT JOIN book_files
      ON books.id = book_files.book_id

    WHERE reading_history.user_id = $1
      AND books.is_deleted = FALSE

    ORDER BY reading_history.last_read_at DESC;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows;
};

export const updateLastPage = async (userId, bookId, lastPage) => {
  const query = `
    UPDATE reading_history
    SET
      last_page = $1,
      last_read_at = CURRENT_TIMESTAMP
    WHERE user_id = $2
      AND book_id = $3
    RETURNING
      id,
      user_id,
      book_id,
      last_page,
      last_read_at;
  `;

  const { rows } = await pool.query(query, [lastPage, userId, bookId]);

  return rows[0] || null;
};