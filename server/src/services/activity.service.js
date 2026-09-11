import { Activity } from "../models/Activity.js";

export const recordActivity = async ({ projectId, userId, action, target, meta }) => {
  try {
    await Activity.create({
      projectId,
      userId,
      action,
      target,
      meta,
    });
  } catch (err) {
    console.error("Failed to record activity:", err);
  }
};
