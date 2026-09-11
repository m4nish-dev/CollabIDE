import { Activity } from "../models/Activity.js";
import { Member } from "../models/Member.js";
import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listActivities = asyncHandler(async (req, res) => {
  const { projectId, workspaceId, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  let projectIds = [];

  if (projectId) {
    projectIds = [projectId];
  } else if (workspaceId) {
    const projects = await Project.find({ workspaceId });
    projectIds = projects.map(p => p._id);
  } else {
    const memberships = await Member.find({ userId: req.user._id });
    projectIds = memberships.map(m => m.projectId);
  }

  const query = { projectId: { $in: projectIds } };

  const activities = await Activity.find(query)
    .populate("userId", "name avatar")
    .populate("projectId", "name")
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  const total = await Activity.countDocuments(query);

  res.status(200).json({
    success: true,
    data: activities,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});
