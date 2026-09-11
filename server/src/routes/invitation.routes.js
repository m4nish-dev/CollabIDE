import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as invitationController from "../controllers/invitation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/permission.middleware.js";

// We have two sets of routes:
// 1. /api/v1/invitations -> for user's own invitations (list, accept, decline)
// 2. /api/v1/projects/:id/invitations -> for project owners to create/manage invitations

const router = Router({ mergeParams: true });

const invitationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many invitation requests, please try again later." },
});

router.use(requireAuth);

// Project specific routes (mounted at /api/v1/projects/:id/invitations in project.routes.js)
router.post("/", requireProjectRole("owner", "admin"), invitationLimiter, invitationController.createInvitation);

export default router;
