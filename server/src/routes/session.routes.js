import { Router } from "express";
import * as sessionController from "../controllers/session.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", sessionController.listSessions);
router.delete("/all", sessionController.revokeAllOtherSessions);
router.delete("/:id", sessionController.revokeSession);

export default router;
