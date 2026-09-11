import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const { isRead, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const query = { userId: req.user._id };
  if (isRead !== undefined) {
    query.isRead = isRead === "true";
  }

  const notifications = await Notification.find(query)
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  const total = await Notification.countDocuments(query);

  res.status(200).json({
    success: true,
    data: notifications,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) throw new ApiError(404, "Notification not found");

  res.status(200).json({ success: true, data: notification });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id }, { isRead: true });
  res.status(200).json({ success: true, message: "All notifications marked as read" });
});
