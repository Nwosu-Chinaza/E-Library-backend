import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [email]);

  return rows[0] || null;
};


export const findRoleByName = async (roleName) => {
  const query = `
    SELECT *
    FROM roles
    WHERE name = $1
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [roleName]);

  return rows[0] || null;
};

export const findUserWithRoleByEmail = async (email) => {
  const query = `
    SELECT
      users.*,
      roles.name AS role
    FROM users
    INNER JOIN roles
      ON users.role_id = roles.id
    WHERE users.email = $1
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [email]);

  return rows[0] || null;
};


export const createUser = async ({
  role_id,
  full_name,
  email,
  password,
  profile_image_url = null,
}) => {
  const query = `
    INSERT INTO users (
      role_id,
      full_name,
      email,
      password,
      profile_image_url
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      role_id,
      full_name,
      email,
      profile_image_url,
      created_at;
  `;

  const values = [
    role_id,
    full_name,
    email,
    password,
    profile_image_url,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};