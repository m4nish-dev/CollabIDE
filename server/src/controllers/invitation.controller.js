import { nanoid } from "nanoid";
import { Invitation } from "../models/Invitation.js";
import { Member } from "../models/Member.js";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import * as emailService from "../services/email.service.js";
import { createNotification } from "../services/notification.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../services/activity.service.js";

export const createInvitation = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { email, role } = req.body;

  const project = await Project.findById(projectId).populate("workspaceId");
  if (!project) throw new ApiError(404, "Project not found");

  const existingInvitation = await Invitation.findOne({
    projectId,
    email: email.toLowerCase(),
    status: "pending",
  });
  if (existingInvitation) throw new ApiError(409, "Invitation already pending for this email");

  // Check if they are already a member
  const targetUser = await User.findOne({ email: email.toLowerCase() });
  if (targetUser) {
    const isMember = await Member.findOne({ projectId, userId: targetUser._id });
    if (isMember) throw new ApiError(409, "User is already a member of this project");
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invitation = await Invitation.create({
    projectId,
    email,
    role,
    token,
    invitedBy: req.user._id,
    expiresAt,
  });

  const inviteUrl = `http://localhost:5173/invite?token=${token}`;
  await emailService.sendInvitation(email, project.name, inviteUrl);

  if (targetUser) {
    await createNotification({
      userId: targetUser._id,
      type: "invitation",
      title: `You've been invited to ${project.name}`,
      body: `${req.user.name} invited you to join ${project.name}`,
      link: `/invite?token=${token}`,
      meta: { projectId, role },
    });
  }

  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "member.invited",
    target: email,
    meta: { role },
  });

  res.status(201).json({ success: true, data: invitation });
});

export const acceptInvitation = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const invitation = await Invitation.findOne({
    token,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });

  if (!invitation) {
    throw new ApiError(400, "Invalid or expired invitation token");
  }

  // Ensure the logged-in user's email matches the invitation email
  if (req.user.email !== invitation.email) {
    throw new ApiError(403, "You can only accept invitations sent to your email address");
  }

  const existingMember = await Member.findOne({
    projectId: invitation.projectId,
    userId: req.user._id,
  });

  if (existingMember) {
    if (existingMember.role !== "owner") {
      existingMember.role = invitation.role;
      await existingMember.save();
    }
  } else {
    await Member.create({
      projectId: invitation.projectId,
      userId: req.user._id,
      role: invitation.role,
      invitedBy: invitation.invitedBy,
    });
  }

  invitation.status = "accepted";
  await invitation.save();

  await recordActivity({
    projectId: invitation.projectId,
    userId: req.user._id,
    action: "member.joined",
    target: req.user.name,
    meta: { role: invitation.role },
  });

  res.status(200).json({ success: true, data: null, message: "Invitation accepted" });
});

export const declineInvitation = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const invitation = await Invitation.findOne({ token, status: "pending" });
  if (!invitation) throw new ApiError(400, "Invalid invitation token");

  if (req.user.email !== invitation.email) {
    throw new ApiError(403, "You can only decline invitations sent to your email address");
  }

  invitation.status = "declined";
  await invitation.save();

  res.status(200).json({ success: true, data: null, message: "Invitation declined" });
});

export const listMyInvitations = asyncHandler(async (req, res) => {
  const invitations = await Invitation.find({
    email: req.user.email,
    status: "pending",
    expiresAt: { $gt: new Date() },
  }).populate("projectId", "name").populate("invitedBy", "name email");

  res.status(200).json({ success: true, data: invitations });
});
