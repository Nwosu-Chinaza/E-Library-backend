import pool from "../config/db.js";

/**
 * Create file records for a book.
 */
export const createBookFiles = async ({
  book_id,
  cover_image_url,
  file_url,
}) => {
  const query = `
    INSERT INTO book_files (
      book_id,
      cover_image_url,
      file_url
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      book_id,
      cover_image_url,
      file_url,
      created_at;
  `;

  const values = [book_id, cover_image_url, file_url];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

/**
 * Get files belonging to a book.
 */
export const getBookFiles = async (bookId) => {
  const query = `
    SELECT
      id,
      book_id,
      cover_image_url,
      file_url,
      created_at
    FROM book_files
    WHERE book_id = $1
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [bookId]);

  return rows[0] || null;
};

/**
 * Delete files belonging to a book.
 */
export const deleteBookFiles = async (bookId) => {
  const query = `
    DELETE FROM book_files
    WHERE book_id = $1
    RETURNING
      id,
      book_id,
      cover_image_url,
      file_url;
  `;

  const { rows } = await pool.query(query, [bookId]);

  return rows[0] || null;
};

