import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// GET /api/v1/health
router.get("/health", (_req, res) => {
  res.status(200).json(
    new ApiResponse(200, { uptime: process.uptime() }, "CollabIDE API v1")
  );
});

export default router;
