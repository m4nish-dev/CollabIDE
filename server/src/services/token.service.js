import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Sign a short-lived JWT access token.
 * @param {{ _id: string, email: string }} user
 * @returns {string} signed JWT
 */
export const signAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES }
  );
};

/**
 * Generate an opaque refresh token and its bcrypt hash.
 * The raw token is sent to the client; only the hash is stored in DB.
 * @returns {Promise<{ rawToken: string, tokenHash: string }>}
 */
export const signRefreshToken = async () => {
  const rawToken = nanoid(64);
  const tokenHash = await bcrypt.hash(rawToken, 10);
  return { rawToken, tokenHash };
};

/**
 * Verify a JWT access token and return the decoded payload.
 * @param {string} token
 * @returns {{ sub: string, email: string, iat: number, exp: number }}
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    throw new ApiError(401, "Invalid access token");
  }
};

/**
 * Verify that a raw refresh token matches a stored hash.
 * @param {string} rawToken
 * @param {string} storedHash
 * @returns {Promise<boolean>}
 */
export const verifyRefreshToken = async (rawToken, storedHash) => {
  return bcrypt.compare(rawToken, storedHash);
};
