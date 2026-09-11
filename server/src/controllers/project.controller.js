import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { Member } from "../models/Member.js";
import { File } from "../models/File.js";
import { seedProjectFiles } from "../services/template.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, visibility, templateId, workspaceId } = req.body;
  const slug = slugify(name) + "-" + Math.random().toString(36).substring(2, 8);

  const project = await Project.create({
    name,
    slug,
    description,
    visibility,
    templateId,
    workspaceId,
    ownerId: req.user._id,
  });

  await Member.create({
    projectId: project._id,
    userId: req.user._id,
    role: "owner",
  });

  if (templateId) {
    await seedProjectFiles(project._id, templateId);
  }

  res.status(201).json({ success: true, data: project });
});

export const listProjects = asyncHandler(async (req, res) => {
  const { scope = "all", search = "", sort = "-updatedAt", page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  // Find all projects where user is a member
  const memberships = await Member.find({ userId: req.user._id });
  const memberProjectIds = memberships.map((m) => m.projectId);

  let query = { _id: { $in: memberProjectIds } };

  if (scope === "starred") {
    query.starredBy = req.user._id;
  } else if (scope === "shared") {
    query.ownerId = { $ne: req.user._id };
  } else if (scope === "archived") {
    query.isArchived = true;
  } else {
    query.isArchived = false;
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const projects = await Project.find(query)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .populate("workspaceId", "name slug");

  const total = await Project.countDocuments(query);

  res.status(200).json({
    success: true,
    data: projects,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("workspaceId", "name slug");
  if (!project) throw new ApiError(404, "Project not found");

  const member = await Member.findOne({ projectId: project._id, userId: req.user._id });
  if (!member && project.visibility === "private") {
    throw new ApiError(403, "Forbidden");
  }

  const memberCount = await Member.countDocuments({ projectId: project._id });

  res.status(200).json({
    success: true,
    data: {
      ...project.toObject(),
      memberCount,
      userRole: member ? member.role : null,
    },
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  await Member.deleteMany({ projectId: req.params.id });
  await File.deleteMany({ projectId: req.params.id });

  res.status(200).json({ success: true, data: null, message: "Project deleted" });
});

export const toggleStar = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  const isStarred = project.starredBy.includes(req.user._id);
  if (isStarred) {
    project.starredBy.pull(req.user._id);
  } else {
    project.starredBy.push(req.user._id);
  }
  await project.save();

  res.status(200).json({ success: true, data: project });
});

export const toggleArchive = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  project.isArchived = !project.isArchived;
  await project.save();

  res.status(200).json({ success: true, data: project });
});

export const duplicateProject = asyncHandler(async (req, res) => {
  const original = await Project.findById(req.params.id);
  if (!original) throw new ApiError(404, "Project not found");

  const newSlug = slugify(original.name + "-copy") + "-" + Math.random().toString(36).substring(2, 8);
  const copy = await Project.create({
    name: original.name + " (Copy)",
    slug: newSlug,
    description: original.description,
    visibility: original.visibility,
    language: original.language,
    framework: original.framework,
    templateId: original.templateId,
    workspaceId: original.workspaceId,
    ownerId: req.user._id,
  });

  // Copy files
  const files = await File.find({ projectId: original._id }).lean();
  const newFiles = files.map(f => {
    delete f._id;
    delete f.createdAt;
    delete f.updatedAt;
    delete f.__v;
    return { ...f, projectId: copy._id };
  });
  if (newFiles.length > 0) {
    await File.insertMany(newFiles);
  }

  // Add owner member
  await Member.create({
    projectId: copy._id,
    userId: req.user._id,
    role: "owner",
  });

  res.status(201).json({ success: true, data: copy });
});
