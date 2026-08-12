import pool from "../config/db.js";

/**
 * Create a new category.
 */
export const createCategory = async ({ name, description }) => {
  const query = `
    INSERT INTO categories (
      name,
      description
    )
    VALUES ($1, $2)
    RETURNING
      id,
      name,
      description,
      created_at,
      updated_at;
  `;

  const { rows } = await pool.query(query, [
    name,
    description,
  ]);

  return rows[0];
};


/**
 * Get all categories.
 */
export const getAllCategories = async () => {
  const query = `
    SELECT
      id,
      name,
      description,
      created_at,
      updated_at
    FROM categories
    ORDER BY name ASC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};


/**
 * Get a category by ID.
 */
export const getCategoryById = async (id) => {
  const query = `
    SELECT
      id,
      name,
      description,
      created_at,
      updated_at
    FROM categories
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};


/**
 * Update a category.
 */
export const updateCategory = async (
  id,
  { name, description },
) => {
  const query = `
    UPDATE categories
    SET
      name = $1,
      description = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING
      id,
      name,
      description,
      created_at,
      updated_at;
  `;

  const { rows } = await pool.query(query, [
    name,
    description,
    id,
  ]);

  return rows[0] || null;
};


/**
 * Delete a category.
 */
export const deleteCategory = async (id) => {
  const query = `
    DELETE FROM categories
    WHERE id = $1
    RETURNING
      id,
      name;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};