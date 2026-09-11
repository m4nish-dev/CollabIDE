import { Workspace } from "../models/Workspace.js";
import { Member } from "../models/Member.js";
import { Project } from "../models/Project.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -

export const createWorkspace = asyncHandler(async (req, res) => {
  const { name, icon, description, defaultVisibility } = req.body;
  const slug = slugify(name) + "-" + Math.random().toString(36).substring(2, 8);

  const workspace = await Workspace.create({
    name,
    slug,
    icon,
    description,
    defaultVisibility,
    ownerId: req.user._id,
  });

  res.status(201).json({ success: true, data: workspace });
});

export const listWorkspaces = asyncHandler(async (req, res) => {
  // Find workspaces where user is owner
  const ownedWorkspaces = await Workspace.find({ ownerId: req.user._id });

  // Find workspaces where user is a member of any project in it
  const memberships = await Member.find({ userId: req.user._id }).populate("projectId");
  const workspaceIds = memberships
    .filter((m) => m.projectId && m.projectId.workspaceId)
    .map((m) => m.projectId.workspaceId.toString());

  const memberWorkspaces = await Workspace.find({
    _id: { $in: workspaceIds },
    ownerId: { $ne: req.user._id }, // exclude owned to avoid duplicates
  });

  res.status(200).json({
    success: true,
    data: [...ownedWorkspaces, ...memberWorkspaces],
  });
});

export const getWorkspaceById = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  // Get project count or member count
  const projects = await Project.find({ workspaceId: workspace._id });
  const projectIds = projects.map((p) => p._id);
  
  // Count unique members across all projects in this workspace
  const members = await Member.distinct("userId", { projectId: { $in: projectIds } });

  // Add owner to member count if not in members
  const memberSet = new Set(members.map(id => id.toString()));
  memberSet.add(workspace.ownerId.toString());

  res.status(200).json({
    success: true,
    data: {
      ...workspace.toObject(),
      memberCount: memberSet.size,
    },
  });
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findOne({
    _id: req.params.id,
    ownerId: req.user._id,
  });
  if (!workspace) throw new ApiError(404, "Workspace not found or unauthorized");

  Object.assign(workspace, req.body);
  if (req.body.name) {
    workspace.slug = slugify(req.body.name) + "-" + Math.random().toString(36).substring(2, 8);
  }
  await workspace.save();

  res.status(200).json({ success: true, data: workspace });
});

export const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findOneAndDelete({
    _id: req.params.id,
    ownerId: req.user._id,
  });
  if (!workspace) throw new ApiError(404, "Workspace not found or unauthorized");

  res.status(200).json({ success: true, data: null, message: "Workspace deleted" });
});
