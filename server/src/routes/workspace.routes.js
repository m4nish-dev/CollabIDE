import { Router } from "express";
import * as workspaceController from "../controllers/workspace.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", workspaceController.createWorkspace);
router.get("/", workspaceController.listWorkspaces);
router.get("/:id", workspaceController.getWorkspaceById);
router.patch("/:id", workspaceController.updateWorkspace);
router.delete("/:id", workspaceController.deleteWorkspace);

export default router;
