import { File } from "../models/File.js";
import { Project } from "../models/Project.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../services/activity.service.js";

const updateProjectActivity = async (projectId) => {
  await Project.findByIdAndUpdate(projectId, { lastActivityAt: Date.now() });
};

export const getTree = asyncHandler(async (req, res) => {
  const tree = await File.buildTree(req.params.id);
  res.status(200).json({ success: true, data: tree });
});

export const readFile = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { path } = req.query;

  if (!path) throw new ApiError(400, "File path is required");

  const file = await File.findOne({ projectId, path });
  if (!file) throw new ApiError(404, "File not found");

  res.status(200).json({ success: true, data: file });
});

export const writeFile = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { path, content } = req.body;

  if (!path) throw new ApiError(400, "File path is required");

  const file = await File.findOneAndUpdate(
    { projectId, path },
    { content },
    { new: true, runValidators: true }
  );

  if (!file) throw new ApiError(404, "File not found");

  await updateProjectActivity(projectId);
  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "file.updated",
    target: file.name,
  });

  res.status(200).json({ success: true, data: file });
});

export const createFile = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { path, type, content, language } = req.body;

  if (!path || !type) throw new ApiError(400, "Path and type are required");

  const existingFile = await File.findOne({ projectId, path });
  if (existingFile) throw new ApiError(409, "File or folder already exists at this path");

  // Determine parent path
  const parts = path.split("/");
  parts.pop();
  const parentPath = parts.join("/");

  const name = path.split("/").pop();

  const newFile = await File.create({
    projectId,
    path,
    name,
    type,
    content: type === "file" ? content || "" : undefined,
    language,
    parentPath,
  });

  await updateProjectActivity(projectId);
  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "file.created",
    target: newFile.name,
  });

  res.status(201).json({ success: true, data: newFile });
});

export const deleteFile = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { path } = req.query;

  if (!path) throw new ApiError(400, "File path is required");

  const file = await File.findOne({ projectId, path });
  if (!file) throw new ApiError(404, "File not found");

  if (file.type === "folder") {
    // Delete the folder and all its children
    const prefixRegex = new RegExp(`^${path}(/|$)`);
    await File.deleteMany({ projectId, path: prefixRegex });
  } else {
    await File.deleteOne({ projectId, path });
  }

  await updateProjectActivity(projectId);
  await recordActivity({
    projectId,
    userId: req.user._id,
    action: "file.deleted",
    target: file.name,
  });

  res.status(200).json({ success: true, data: null, message: "Deleted successfully" });
});

export const renameFile = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { oldPath, newPath } = req.body;

  if (!oldPath || !newPath) throw new ApiError(400, "oldPath and newPath are required");

  const file = await File.findOne({ projectId, path: oldPath });
  if (!file) throw new ApiError(404, "File not found");

  const existingNewFile = await File.findOne({ projectId, path: newPath });
  if (existingNewFile) throw new ApiError(409, "Destination path already exists");

  const oldName = file.name;
  const newName = newPath.split("/").pop();
  
  const newParts = newPath.split("/");
  newParts.pop();
  const newParentPath = newParts.join("/");

  if (file.type === "folder") {
    // Rename all children paths that start with oldPath
    const children = await File.find({
      projectId,
      path: new RegExp(`^${oldPath}/`),
    });

    for (const child of children) {
      const childNewPath = child.path.replace(oldPath, newPath);
      
      const childParts = childNewPath.split("/");
      childParts.pop();
      const childNewParentPath = childParts.join("/");

      child.path = childNewPath;
      child.parentPath = childNewParentPath;
      await child.save();
    }
  }

  file.path = newPath;
  file.name = newName;
  file.parentPath = newParentPath;
  await file.save();

  await updateProjectActivity(projectId);
  res.status(200).json({ success: true, data: file });
});
