import crypto from "crypto";
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
  // Generate a secure random verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Token expires after 24 hours
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const query = `
    INSERT INTO users (
      role_id,
      full_name,
      email,
      password,
      profile_image_url,
      verification_token,
      verification_token_expires,
      email_verified
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE)
    RETURNING
      id,
      role_id,
      full_name,
      email,
      profile_image_url,
      email_verified,
      verification_token,
      verification_token_expires,
      created_at;
  `;

  const values = [
    role_id,
    full_name,
    email,
    password,
    profile_image_url,
    verificationToken,
    verificationTokenExpires,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const verifyUserEmail = async (token) => {
  const query = `
    UPDATE users
    SET
      email_verified = TRUE,
      verification_token = NULL,
      verification_token_expires = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE verification_token = $1
      AND verification_token_expires > CURRENT_TIMESTAMP
    RETURNING
      id,
      full_name,
      email,
      email_verified;
  `;

  const { rows } = await pool.query(query, [token]);

  return rows[0] || null;
};

export const createPasswordResetToken = async (email) => {
  // Generate a secure random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Token expires after 1 hour
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

  const query = `
    UPDATE users
    SET
      reset_token = $1,
      reset_token_expires = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE email = $3
    RETURNING
      id,
      full_name,
      email,
      reset_token,
      reset_token_expires;
  `;

  const { rows } = await pool.query(query, [
    resetToken,
    resetTokenExpires,
    email,
  ]);

  return rows[0] || null;
};
export const resetUserPassword = async (token, hashedPassword) => {
  const query = `
    UPDATE users
    SET
      password = $1,
      reset_token = NULL,
      reset_token_expires = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE reset_token = $2
      AND reset_token_expires > CURRENT_TIMESTAMP
    RETURNING
      id,
      full_name,
      email;
  `;

  const { rows } = await pool.query(query, [hashedPassword, token]);

  return rows[0] || null;
};