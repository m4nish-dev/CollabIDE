import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const url = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:4000";
    const token = useAuthStore.getState().token;

    socket = io(url, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }
  return socket;
};

export const joinProject = (projectId) => {
  if (!projectId) return;
  getSocket().emit("project:join", { projectId });
};

export const leaveProject = (projectId) => {
  if (!projectId) return;
  getSocket().emit("project:leave", { projectId });
};

export const openFile = (projectId, filePath) => {
  if (!projectId || !filePath) return;
  getSocket().emit("file:open", { projectId, filePath });
};

export const sendCursor = (projectId, filePath, position) => {
  getSocket().emit("cursor:move", { projectId, filePath, position });
};

export const sendEdit = (projectId, filePath, patch) => {
  getSocket().emit("file:edit", { projectId, filePath, patch });
};

export const onCursor = (cb) => {
  const s = getSocket();
  s.on("cursor:move", cb);
  return () => s.off("cursor:move", cb);
};

export const onEdit = (cb) => {
  const s = getSocket();
  s.on("file:edit", cb);
  return () => s.off("file:edit", cb);
};

export const onPresence = (cb) => {
  const s = getSocket();
  s.on("presence:update", cb);
  return () => s.off("presence:update", cb);
};

export const onNotification = (cb) => {
  const s = getSocket();
  s.on("notification:new", cb);
  return () => s.off("notification:new", cb);
};

export const onFileOpen = (cb) => {
  const s = getSocket();
  s.on("file:open", cb);
  return () => s.off("file:open", cb);
};
