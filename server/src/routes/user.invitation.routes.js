import { Router } from "express";
import * as invitationController from "../controllers/invitation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/me", invitationController.listMyInvitations);
router.post("/accept", invitationController.acceptInvitation);
router.post("/decline", invitationController.declineInvitation);

export default router;
