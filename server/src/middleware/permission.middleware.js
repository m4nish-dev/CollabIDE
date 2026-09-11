import { Member } from "../models/Member.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Require a specific role in a project.
 * Expects req.params.id to contain the projectId.
 * @param  {...string} allowedRoles - e.g., "owner", "admin", "editor"
 */
export const requireProjectRole = (...allowedRoles) =>
  asyncHandler(async (req, _res, next) => {
    const projectId = req.params.id || req.params.projectId;
    if (!projectId) {
      throw new ApiError(400, "Project ID is required");
    }

    const member = await Member.findOne({
      projectId,
      userId: req.user._id,
    });

    if (!member || !allowedRoles.includes(member.role)) {
      throw new ApiError(
        403,
        `Forbidden: Requires one of the following roles: ${allowedRoles.join(", ")}`
      );
    }

    req.projectMember = member;
    next();
  });

export const requireProjectOwner = requireProjectRole("owner");
