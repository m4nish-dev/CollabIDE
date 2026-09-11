import { Router } from "express";
import * as gitController from "../controllers/git.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/permission.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/status", requireProjectRole("owner", "admin", "editor", "viewer"), gitController.status);

router.get("/branches", requireProjectRole("owner", "admin", "editor", "viewer"), gitController.listBranches);
router.post("/branches", requireProjectRole("owner", "admin", "editor"), gitController.createBranch);
router.delete("/branches/:branchName", requireProjectRole("owner", "admin"), gitController.deleteBranch);
router.post("/branches/switch", requireProjectRole("owner", "admin", "editor", "viewer"), gitController.switchBranch);

router.get("/commits", requireProjectRole("owner", "admin", "editor", "viewer"), gitController.listCommits);
router.post("/commits", requireProjectRole("owner", "admin", "editor"), gitController.createCommit);

export default router;
