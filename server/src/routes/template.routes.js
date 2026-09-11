import { Router } from "express";
import { getTemplates } from "../controllers/template.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getTemplates);

export default router;
