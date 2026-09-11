import { Notification } from "../models/Notification.js";

// Lazy loading to avoid circular dependencies
let getIo;
const getSocketIo = async () => {
  if (!getIo) {
    const sockets = await import("../sockets/index.js");
    getIo = sockets.getIo;
  }
  return getIo();
};

export const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);

    try {
      const io = await getSocketIo();
      io.to(`user:${data.userId}`).emit("notification:new", notification);
    } catch (ioError) {
      // It's okay if IO is not initialized or fails, as long as notification was created
      console.warn("Failed to emit notification socket event", ioError.message);
    }

    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err);
    throw err;
  }
};
