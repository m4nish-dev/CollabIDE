import { Server } from "socket.io";
import { env } from "../config/env.js";
import { verifyAccessToken } from "../services/token.service.js";
import { User } from "../models/User.js";
import { registerCollabHandlers } from "./collab.handler.js";
import { registerNotificationHandlers } from "./notification.handler.js";

let io;

export const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("unauthorized"));

      const payload = await verifyAccessToken(token);
      const user = await User.findById(payload.sub).select("-passwordHash -__v");
      if (!user) return next(new Error("unauthorized"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] User connected: ${socket.user.email} (${socket.id})`);
    
    // Join personal room for notifications
    socket.join(`user:${socket.user._id.toString()}`);

    registerCollabHandlers(io, socket);
    registerNotificationHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`[Socket] User disconnected: ${socket.user.email} (${socket.id})`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
