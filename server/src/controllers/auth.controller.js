import ms from "ms";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as authService from "../services/auth.service.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    domain: env.COOKIE_DOMAIN,
    maxAge: ms(env.JWT_REFRESH_EXPIRES),
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    domain: env.COOKIE_DOMAIN,
  });
};

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  setRefreshCookie(res, result.refreshToken);

  res.status(201).json(
    new ApiResponse(201, {
      user: result.user,
      accessToken: result.accessToken,
    }, "User registered successfully")
  );
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login({
    ...req.body,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });
  setRefreshCookie(res, result.refreshToken);

  res.status(200).json(
    new ApiResponse(200, {
      user: result.user,
      accessToken: result.accessToken,
    }, "Login successful")
  );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    const [sessionId] = refreshToken.split(".");
    if (sessionId) {
      await authService.logout({ sessionId });
    }
  }
  clearRefreshCookie(res);

  res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const result = await authService.refresh({
    refreshToken,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });
  setRefreshCookie(res, result.refreshToken);

  res.status(200).json(
    new ApiResponse(200, {
      user: result.user,
      accessToken: result.accessToken,
    }, "Token refreshed successfully")
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body);
  // Always return success even if user not found for security
  res.status(200).json(new ApiResponse(200, null, "Password reset email sent if account exists"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body);
  res.status(200).json(new ApiResponse(200, null, "Email verified successfully"));
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }));
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, avatar, bio, location, website, timezone, username } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar, bio, location, website, timezone, username },
    { new: true, runValidators: true }
  );
  res.status(200).json(new ApiResponse(200, { user }, "Profile updated"));
});

export const updateEmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findById(req.user._id).select("+passwordHash");
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new ApiError(401, "Incorrect password");

  user.email = email;
  user.isEmailVerified = false; // Require re-verification
  await user.save();

  res.status(200).json(new ApiResponse(200, { user }, "Email updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  const user = await User.findById(req.user._id).select("+passwordHash");
  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) throw new ApiError(401, "Incorrect old password");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});
