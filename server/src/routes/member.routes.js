import { Router } from "express";
import * as memberController from "../controllers/member.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/permission.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", requireProjectRole("owner", "admin", "editor", "viewer"), memberController.listMembers);
router.patch("/:memberId/role", requireProjectRole("owner", "admin"), memberController.updateRole);
router.delete("/:memberId", requireProjectRole("owner", "admin"), memberController.removeMember);

export default router;
