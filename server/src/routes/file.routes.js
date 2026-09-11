import { Router } from "express";
import * as fileController from "../controllers/file.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/permission.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/tree", requireProjectRole("owner", "admin", "editor", "viewer"), fileController.getTree);
router.get("/", requireProjectRole("owner", "admin", "editor", "viewer"), fileController.readFile);
router.put("/", requireProjectRole("owner", "admin", "editor"), fileController.writeFile);
router.post("/", requireProjectRole("owner", "admin", "editor"), fileController.createFile);
router.delete("/", requireProjectRole("owner", "admin", "editor"), fileController.deleteFile);
router.patch("/rename", requireProjectRole("owner", "admin", "editor"), fileController.renameFile);

export default router;
