/**
 * Wraps an async route handler so any thrown error is forwarded to next()
 * instead of causing an unhandled promise rejection.
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function}
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
