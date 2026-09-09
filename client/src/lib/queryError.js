export class QueryError extends Error {
  constructor(message, status = 500, code = "UNKNOWN_ERROR") {
    super(message);
    this.name = "QueryError";
    this.status = status;
    this.code = code;
  }
}

export const normalizeError = (error) => {
  if (error instanceof QueryError) return error;

  // Handle generic Fetch errors (e.g., network down)
  if (error instanceof TypeError) {
    return new QueryError("Network error or server unreachable", 0, "NETWORK_ERROR");
  }

  return new QueryError(error.message || "An unexpected error occurred");
};
