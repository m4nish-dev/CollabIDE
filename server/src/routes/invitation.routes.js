import { Router } from "express";
import * as invitationController from "../controllers/invitation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/permission.middleware.js";

// We have two sets of routes:
// 1. /api/v1/invitations -> for user's own invitations (list, accept, decline)
// 2. /api/v1/projects/:id/invitations -> for project owners to create/manage invitations

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Project specific routes (mounted at /api/v1/projects/:id/invitations in project.routes.js)
router.post("/", requireProjectRole("owner", "admin"), invitationController.createInvitation);

export default router;
