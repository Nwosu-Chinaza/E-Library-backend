import pool from "../config/db.js";

//  Add a book to a user's favorites.
export const addFavorite = async (userId, bookId) => {
  const query = `
    INSERT INTO favorites (
      user_id,
      book_id
    )
    VALUES ($1, $2)
    ON CONFLICT (user_id, book_id)
    DO NOTHING
    RETURNING
      id,
      user_id,
      book_id,
      created_at;
  `;

  const { rows } = await pool.query(query, [userId, bookId]);

  return rows[0] || null;
};

//  Remove a book from a user's favorites.
export const removeFavorite = async (userId, bookId) => {
  const query = `
    DELETE FROM favorites
    WHERE user_id = $1
      AND book_id = $2
    RETURNING
      id,
      user_id,
      book_id;
  `;

  const { rows } = await pool.query(query, [userId, bookId]);

  return rows[0] || null;
};

//   Get all books favorited by a user.
export const getFavoritesByUser = async (userId) => {
  const query = `
    SELECT
      favorites.id,
      favorites.book_id,
      favorites.created_at,

      books.title,
      books.author,
      books.description,
      book_files.cover_image_url

    FROM favorites

    INNER JOIN books
      ON favorites.book_id = books.id

    LEFT JOIN book_files
      ON books.id = book_files.book_id

    WHERE favorites.user_id = $1
      AND books.is_deleted = FALSE

    ORDER BY favorites.created_at DESC;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows;
};
