import { Branch } from "../models/Branch.js";
import { Commit } from "../models/Commit.js";
import { File } from "../models/File.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../services/activity.service.js";

// Mock status: returns all files modified in the last 24h as "changes"
export const status = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;

  let currentBranch = await Branch.findOne({ projectId, isDefault: true });
  if (!currentBranch) {
    currentBranch = await Branch.create({
      projectId,
      name: "main",
      isDefault: true,
      createdBy: req.user._id,
    });
  }

  const recentFiles = await File.find({
    projectId,
    updatedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  const changes = recentFiles.map((f) => ({
    path: f.path,
    type: "modified",
  }));

  res.status(200).json({
    success: true,
    data: {
      branch: currentBranch.name,
      changes,
    },
  });
});

export const listBranches = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const branches = await Branch.find({ projectId }).populate("createdBy", "name");
  res.status(200).json({ success: true, data: branches });
});

export const createBranch = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { name } = req.body;

  if (!name) throw new ApiError(400, "Branch name is required");

  const existing = await Branch.findOne({ projectId, name });
  if (existing) throw new ApiError(409, "Branch already exists");

  const branch = await Branch.create({
    projectId,
    name,
    createdBy: req.user._id,
  });

  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "branch.created",
    target: name,
  });

  res.status(201).json({ success: true, data: branch });
});

export const deleteBranch = asyncHandler(async (req, res) => {
  const { id: projectId, branchName } = req.params;

  const branch = await Branch.findOne({ projectId, name: branchName });
  if (!branch) throw new ApiError(404, "Branch not found");
  if (branch.isDefault) throw new ApiError(400, "Cannot delete default branch");

  await Branch.deleteOne({ _id: branch._id });

  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "branch.deleted",
    target: branchName,
  });

  res.status(200).json({ success: true, data: null, message: "Branch deleted" });
});

export const switchBranch = asyncHandler(async (req, res) => {
  // In a real app, this would checkout file contents.
  // Here we just validate it exists.
  const { id: projectId } = req.params;
  const { name } = req.body;

  const branch = await Branch.findOne({ projectId, name });
  if (!branch) throw new ApiError(404, "Branch not found");

  res.status(200).json({ success: true, data: branch, message: "Switched branch" });
});

export const listCommits = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { branch = "main" } = req.query;

  const commits = await Commit.find({ projectId, branchName: branch })
    .sort("-createdAt")
    .populate("authorId", "name avatar email");

  res.status(200).json({ success: true, data: commits });
});

export const createCommit = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { message, changes = [], branchName = "main" } = req.body;

  if (!message) throw new ApiError(400, "Commit message is required");

  const branch = await Branch.findOne({ projectId, name: branchName });
  if (!branch) throw new ApiError(404, "Branch not found");

  let parentSha = null;
  if (branch.headCommitId) {
    const parentCommit = await Commit.findById(branch.headCommitId);
    if (parentCommit) parentSha = parentCommit.sha;
  }

  const commit = await Commit.create({
    projectId,
    branchName,
    message,
    authorId: req.user._id,
    changes,
    parentSha,
  });

  branch.headCommitId = commit._id;
  await branch.save();

  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "commit.created",
    target: commit.sha,
    meta: { message },
  });

  res.status(201).json({ success: true, data: commit });
});
