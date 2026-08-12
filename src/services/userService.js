import pool from "../config/db.js";

/**
 * Get a user by ID
 */
export const getUserById = async (userId) => {
  const query = `
    SELECT
      users.id,
      users.full_name,
      users.email,
      roles.name AS role,
      users.profile_image_url,
      users.created_at,
      users.updated_at
    FROM users
    INNER JOIN roles
      ON users.role_id = roles.id
    WHERE users.id = $1;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows[0] || null;
};

/**
 * Update user's name and email
 */
export const updateUserProfile = async (userId, { full_name, email }) => {
  const query = `
    UPDATE users
    SET
      full_name = $1,
      email = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING
      id,
      full_name,
      email,
      profile_image_url,
      created_at,
      updated_at;
  `;

  const { rows } = await pool.query(query, [full_name, email, userId]);

  return rows[0] || null;
};

/**
 * Get user's password
 * Used internally when changing password.
 */
export const getUserPassword = async (userId) => {
  const query = `
    SELECT password
    FROM users
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows[0] || null;
};

/**
 * Update user's password
 */
export const updateUserPassword = async (userId, hashedPassword) => {
  const query = `
    UPDATE users
    SET
      password = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id;
  `;

  const { rows } = await pool.query(query, [hashedPassword, userId]);

  return rows[0] || null;
};
