import { Member } from "../models/Member.js";
import { Project } from "../models/Project.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../services/activity.service.js";

export const listMembers = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const members = await Member.find({ projectId }).populate("userId", "name email avatar username");
  res.status(200).json({ success: true, data: members });
});

export const updateRole = asyncHandler(async (req, res) => {
  const { id: projectId, memberId } = req.params;
  const { newRole } = req.body;

  if (!["admin", "editor", "viewer"].includes(newRole)) {
    throw new ApiError(400, "Invalid role. Cannot set role to owner.");
  }

  const targetMember = await Member.findById(memberId).populate("userId", "name");
  if (!targetMember || targetMember.projectId.toString() !== projectId) {
    throw new ApiError(404, "Member not found in this project");
  }

  if (targetMember.role === "owner") {
    throw new ApiError(400, "Cannot change role of project owner");
  }

  targetMember.role = newRole;
  await targetMember.save();

  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "member.updated",
    target: targetMember.userId.name,
    meta: { newRole },
  });

  res.status(200).json({ success: true, data: targetMember });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { id: projectId, memberId } = req.params;

  const targetMember = await Member.findById(memberId).populate("userId", "name");
  if (!targetMember || targetMember.projectId.toString() !== projectId) {
    throw new ApiError(404, "Member not found in this project");
  }

  if (targetMember.role === "owner") {
    throw new ApiError(400, "Cannot remove project owner");
  }

  await Member.findByIdAndDelete(memberId);

  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "member.removed",
    target: targetMember.userId.name,
  });

  res.status(200).json({ success: true, data: null, message: "Member removed" });
});
