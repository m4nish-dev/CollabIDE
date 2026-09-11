import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import { signAccessToken, signRefreshToken } from "./token.service.js";
import * as emailService from "./email.service.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Register a new user
 */
export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  const accessToken = signAccessToken(user);
  const { rawToken: refreshToken, tokenHash } = await signRefreshToken();

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return { 
    user, 
    accessToken, 
    refreshToken: `${session._id}.${refreshToken}`, 
    sessionId: session._id 
  };
};

/**
 * Login a user
 */
export const login = async ({ email, password, userAgent, ip }) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = signAccessToken(user);
  const { rawToken: refreshToken, tokenHash } = await signRefreshToken();

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: tokenHash,
    userAgent,
    ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return { 
    user, 
    accessToken, 
    refreshToken: `${session._id}.${refreshToken}`, 
    sessionId: session._id 
  };
};

/**
 * Logout a user by deleting their session
 */
export const logout = async ({ sessionId }) => {
  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }
};

/**
 * Refresh an access token using a valid refresh token
 */
export const refresh = async ({ refreshToken, userAgent, ip }) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  // Find all sessions, ideally we could optimize this, but for now we search all valid sessions
  // A better approach is to store the sessionId in the refresh token payload if it was a JWT,
  // but since it's opaque, we check sessions, or we could pass sessionId in cookie.
  // Wait, if it's opaque, we have to find a session that matches the hash.
  // We can't easily query by hash since bcrypt produces different hashes.
  // Ah, the requirements say "find matching Session by comparing bcrypt".
  // This means we have to load sessions and compare. If we have many sessions, this is slow.
  // Let's change the refresh token to be `${sessionId}.${rawToken}` so we can look up the session by ID.
  const [sessionId, rawToken] = refreshToken.split(".");
  
  if (!sessionId || !rawToken) {
    throw new ApiError(401, "Invalid refresh token format");
  }

  const session = await Session.findById(sessionId).populate("userId");
  
  if (!session || session.expiresAt < new Date()) {
    if (session) await Session.findByIdAndDelete(sessionId);
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const isMatch = await bcrypt.compare(rawToken, session.refreshTokenHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = session.userId;
  const accessToken = signAccessToken(user);
  const { rawToken: newRawToken, tokenHash } = await signRefreshToken();

  // Rotate token
  session.refreshTokenHash = tokenHash;
  session.userAgent = userAgent || session.userAgent;
  session.ip = ip || session.ip;
  session.lastActive = new Date();
  session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await session.save();

  return { 
    accessToken, 
    refreshToken: `${session._id}.${newRawToken}`,
    user 
  };
};

/**
 * Request password reset
 */
export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) return; // Don't reveal if user exists

  const resetToken = nanoid(32);
  user.passwordResetToken = await bcrypt.hash(resetToken, 10);
  user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;
  await emailService.sendPasswordReset(email, resetUrl);
};

/**
 * Reset password
 */
export const resetPassword = async ({ email, token, newPassword }) => {
  const user = await User.findOne({ 
    email, 
    passwordResetExpires: { $gt: Date.now() } 
  }).select("+passwordResetToken");

  if (!user || !user.passwordResetToken) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  const isValid = await bcrypt.compare(token, user.passwordResetToken);
  if (!isValid) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

/**
 * Verify email
 */
export const verifyEmail = async ({ token, email }) => {
  const user = await User.findOne({ email }).select("+emailVerificationToken");
  if (!user || !user.emailVerificationToken) {
    throw new ApiError(400, "Invalid verification request");
  }

  const isValid = await bcrypt.compare(token, user.emailVerificationToken);
  if (!isValid) {
    throw new ApiError(400, "Invalid verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
};
