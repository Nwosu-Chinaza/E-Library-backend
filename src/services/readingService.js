import pool from "../config/db.js";

/**
 * Get a book and its document for reading.
 */
export const getBookForReading = async (bookId) => {
  const query = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.description,
      books.language,
      books.pages,
      books.publication_year,

      book_files.file_url,
      book_files.cover_image_url

    FROM books

    INNER JOIN book_files
      ON books.id = book_files.book_id

    WHERE books.id = $1
      AND books.is_deleted = FALSE

    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [bookId]);

  return rows[0] || null;
};
