import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return next(new ApiError(400, "Validation failed", result.error.issues));
  }
  req[source] = result.data;
  next();
};
