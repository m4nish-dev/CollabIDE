import { User } from "../models/User.js";
import { verifyAccessToken } from "../services/token.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Not authenticated");
  
  const payload = verifyAccessToken(token); // throws on invalid
  
  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, "User no longer exists");
  
  req.user = user;
  next();
});
