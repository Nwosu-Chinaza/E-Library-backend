import pool from "../config/db.js";

/**
 * Get all books.
 *
 * Returns book information together with
 * the category name and creator's name.
 */
export const getAllBooks = async ({ limit, offset }) => {
  const query = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.description,
      books.isbn,
      books.publication_year,
      books.language,
      books.pages,
      books.download_count,
      books.created_at,
      books.updated_at,

      categories.id AS category_id,
      categories.name AS category_name,

      users.id AS created_by,
      users.full_name AS creator_name,

      book_files.cover_image_url,
      book_files.file_url

    FROM books

    INNER JOIN categories
      ON books.category_id = categories.id

    INNER JOIN users
      ON books.created_by = users.id

    LEFT JOIN book_files
      ON books.id = book_files.book_id

    WHERE books.is_deleted = FALSE

    ORDER BY books.created_at DESC

    LIMIT $1
    OFFSET $2;
  `;

  const { rows } = await pool.query(query, [limit, offset]);

  return rows;
};

/**
 * Get a single book by its ID.
 */
export const getBookById = async (bookId) => {
  const query = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.description,
      books.isbn,
      books.publication_year,
      books.language,
      books.pages,
      books.download_count,
      books.created_at,
      books.updated_at,

      categories.id AS category_id,
      categories.name AS category_name,

      users.id AS created_by,
      users.full_name AS creator_name,

      book_files.cover_image_url,
      book_files.file_url

    FROM books

    INNER JOIN categories
      ON books.category_id = categories.id

    INNER JOIN users
      ON books.created_by = users.id

    LEFT JOIN book_files
      ON books.id = book_files.book_id

    WHERE books.id = $1
      AND books.is_deleted = FALSE

    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [bookId]);

  return rows[0] || null;
};

/**
 * Search books by title or author.
 */
export const searchBooks = async (keyword) => {
  const query = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.description,
      books.publication_year,
      books.language,
      books.pages,
      books.download_count,

      categories.id AS category_id,
      categories.name AS category_name,

      book_files.cover_image_url,
      book_files.file_url

    FROM books

    INNER JOIN categories
      ON books.category_id = categories.id

    LEFT JOIN book_files
      ON books.id = book_files.book_id

    WHERE books.is_deleted = FALSE
      AND (
        books.title ILIKE $1
        OR books.author ILIKE $1
      )

    ORDER BY books.title ASC;
  `;

  const searchValue = `%${keyword}%`;

  const { rows } = await pool.query(query, [searchValue]);

  return rows;
};

/**
 * Create a new book.
 */
export const createBook = async ({
  category_id,
  created_by,
  title,
  author,
  description,
  isbn,
  publication_year,
  language,
  pages,
}) => {
  const query = `
    INSERT INTO books (
      category_id,
      created_by,
      title,
      author,
      description,
      isbn,
      publication_year,
      language,
      pages
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9
    )
    RETURNING
      id,
      category_id,
      created_by,
      title,
      author,
      description,
      isbn,
      publication_year,
      language,
      pages,
      download_count,
      created_at;
  `;

  const values = [
    category_id,
    created_by,
    title,
    author,
    description,
    isbn,
    publication_year,
    language,
    pages,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

/**
 * Update an existing book.
 */
export const updateBook = async (
  bookId,
  {
    category_id,
    title,
    author,
    description,
    isbn,
    publication_year,
    language,
    pages,
  },
) => {
  const query = `
    UPDATE books
    SET
      category_id = $1,
      title = $2,
      author = $3,
      description = $4,
      isbn = $5,
      publication_year = $6,
      language = $7,
      pages = $8,
      updated_at = CURRENT_TIMESTAMP

    WHERE id = $9
      AND is_deleted = FALSE

    RETURNING
      id,
      category_id,
      created_by,
      title,
      author,
      description,
      isbn,
      publication_year,
      language,
      pages,
      download_count,
      created_at,
      updated_at;
  `;

  const values = [
    category_id,
    title,
    author,
    description,
    isbn,
    publication_year,
    language,
    pages,
    bookId,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};

// soft deelete book by setting is_deleted to TRUE
export const deleteBook = async (bookId) => {
  const query = `
    UPDATE books
    SET
      is_deleted = TRUE,
      updated_at = CURRENT_TIMESTAMP

    WHERE id = $1
      AND is_deleted = FALSE

    RETURNING id, title;
  `;

  const { rows } = await pool.query(query, [bookId]);

  return rows[0] || null;
};

export const incrementDownloadCount = async (bookId) => {
  const query = `
    UPDATE books
    SET download_count = download_count + 1
    WHERE id = $1
    AND is_deleted = FALSE
    RETURNING id, download_count;
  `;

  const { rows } = await pool.query(query, [bookId]);

  return rows[0] || null;
};