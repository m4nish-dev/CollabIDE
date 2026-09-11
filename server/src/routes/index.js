import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import authRoutes from "./auth.routes.js";
import workspaceRoutes from "./workspace.routes.js";
import projectRoutes from "./project.routes.js";
import notificationRoutes from "./notification.routes.js";
import sessionRoutes from "./session.routes.js";
import userInvitationRoutes from "./user.invitation.routes.js";
import activityRoutes from "./activity.routes.js";
import templateRoutes from "./template.routes.js";

const router = Router();

// GET /api/v1/health
router.get("/health", (_req, res) => {
  res.status(200).json(
    new ApiResponse(200, { uptime: process.uptime() }, "CollabIDE API v1")
  );
});

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/notifications", notificationRoutes);
router.use("/sessions", sessionRoutes);
router.use("/invitations", userInvitationRoutes);
router.use("/activities", activityRoutes);
router.use("/templates", templateRoutes);

export default router;
