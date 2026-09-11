import { Session } from "../models/Session.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ userId: req.user._id }).sort("-lastActive");
  res.status(200).json({ success: true, data: sessions });
});

export const revokeSession = asyncHandler(async (req, res) => {
  const session = await Session.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!session) throw new ApiError(404, "Session not found");

  res.status(200).json({ success: true, data: null, message: "Session revoked" });
});

export const revokeAllOtherSessions = asyncHandler(async (req, res) => {
  const currentRefreshToken = req.cookies?.refreshToken;
  let currentSessionId = null;

  if (currentRefreshToken) {
    [currentSessionId] = currentRefreshToken.split(".");
  }

  const query = { userId: req.user._id };
  if (currentSessionId) {
    query._id = { $ne: currentSessionId };
  }

  await Session.deleteMany(query);

  res.status(200).json({ success: true, message: "All other sessions revoked" });
});
