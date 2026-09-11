import { Member } from "../models/Member.js";
import { File } from "../models/File.js";

export const registerCollabHandlers = (io, socket) => {
  const userPayload = {
    id: socket.user._id.toString(),
    name: socket.user.name,
    avatar: socket.user.avatar,
  };

  // Keep track of which project/files the socket is in
  const activeProjects = new Set();
  const activeFiles = new Map(); // projectId -> Set of filePaths

  const broadcastPresence = (projectId, event, extra = {}) => {
    socket.to(`project:${projectId}`).emit(event, {
      ...userPayload,
      projectId,
      ...extra,
    });
  };

  socket.on("project:join", async ({ projectId }) => {
    try {
      const isMember = await Member.findOne({ projectId, userId: socket.user._id });
      if (!isMember) return;

      const projectRoom = `project:${projectId}`;
      socket.join(projectRoom);
      activeProjects.add(projectId);

      broadcastPresence(projectId, "presence:update", { action: "join", role: isMember.role });
    } catch (err) {
      console.error("project:join error", err);
    }
  });

  socket.on("project:leave", ({ projectId }) => {
    const projectRoom = `project:${projectId}`;
    socket.leave(projectRoom);
    activeProjects.delete(projectId);

    // Leave all file rooms for this project
    const files = activeFiles.get(projectId);
    if (files) {
      files.forEach((filePath) => {
        socket.leave(`project:${projectId}:file:${filePath}`);
      });
      activeFiles.delete(projectId);
    }

    broadcastPresence(projectId, "presence:update", { action: "leave" });
  });

  socket.on("disconnecting", () => {
    activeProjects.forEach((projectId) => {
      broadcastPresence(projectId, "presence:update", { action: "leave" });
    });
  });

  socket.on("file:open", ({ projectId, filePath }) => {
    const fileRoom = `project:${projectId}:file:${filePath}`;
    socket.join(fileRoom);

    if (!activeFiles.has(projectId)) {
      activeFiles.set(projectId, new Set());
    }
    activeFiles.get(projectId).add(filePath);

    broadcastPresence(projectId, "file:open", { filePath });
  });

  socket.on("file:close", ({ projectId, filePath }) => {
    const fileRoom = `project:${projectId}:file:${filePath}`;
    socket.leave(fileRoom);

    if (activeFiles.has(projectId)) {
      activeFiles.get(projectId).delete(filePath);
    }
  });

  socket.on("cursor:move", ({ projectId, filePath, position }) => {
    const fileRoom = `project:${projectId}:file:${filePath}`;
    socket.to(fileRoom).emit("cursor:move", {
      userId: userPayload.id,
      filePath,
      position,
    });
  });

  socket.on("selection:change", ({ projectId, filePath, range }) => {
    const fileRoom = `project:${projectId}:file:${filePath}`;
    socket.to(fileRoom).emit("selection:change", {
      userId: userPayload.id,
      filePath,
      range,
    });
  });

  socket.on("file:edit", async ({ projectId, filePath, patch }) => {
    const fileRoom = `project:${projectId}:file:${filePath}`;
    
    // Broadcast immediately for smooth feeling
    socket.to(fileRoom).emit("file:edit", {
      userId: userPayload.id,
      filePath,
      patch,
    });

    // MVP: "patch" is just the full new content
    try {
      await File.findOneAndUpdate(
        { projectId, path: filePath },
        { content: patch },
        { runValidators: true }
      );
    } catch (err) {
      console.error("Error saving file edit", err);
    }
  });

  socket.on("user:typing", ({ projectId, filePath }) => {
    const fileRoom = `project:${projectId}:file:${filePath}`;
    socket.to(fileRoom).emit("user:typing", {
      userId: userPayload.id,
      filePath,
    });
  });
};
