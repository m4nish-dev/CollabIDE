import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const notFound = asyncHandler(async (req, _res, _next) => {
  throw new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
});
