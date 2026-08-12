import pool from "../config/db.js";

/**
 * Get dashsboard statistics
 */
export const getDashboardStats = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*)
       FROM users) AS total_users,

      (SELECT COUNT(*)
       FROM books
       WHERE is_deleted = FALSE) AS total_books,

      (SELECT COUNT(*)
       FROM categories) AS total_categories,

      (SELECT COALESCE(SUM(download_count), 0)
       FROM books
       WHERE is_deleted = FALSE) AS total_downloads,

      (SELECT COUNT(*)
       FROM favorites) AS total_favorites,

      (SELECT COUNT(*)
       FROM reading_history) AS total_reading_history;
  `;

  const { rows } = await pool.query(query);

  return rows[0];
};
