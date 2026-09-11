import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/permission.middleware.js";
import fileRoutes from "./file.routes.js";
import memberRoutes from "./member.routes.js";
import invitationRoutes from "./invitation.routes.js";
import gitRoutes from "./git.routes.js";

const router = Router();

router.use(requireAuth);

router.post("/", projectController.createProject);
router.get("/", projectController.listProjects);
router.get("/:id", projectController.getProjectById);
router.patch("/:id", requireProjectRole("owner", "admin", "editor"), projectController.updateProject);
router.delete("/:id", requireProjectRole("owner"), projectController.deleteProject);

router.post("/:id/star", projectController.toggleStar);
router.post("/:id/archive", requireProjectRole("owner", "admin"), projectController.toggleArchive);
router.post("/:id/duplicate", projectController.duplicateProject);

// Mount nested routes under project
router.use("/:id/files", fileRoutes);
router.use("/:id/members", memberRoutes);
router.use("/:id/invitations", invitationRoutes);
router.use("/:id/git", gitRoutes);

export default router;
