import { nanoid } from "nanoid";

export const requestId = (req, res, next) => {
  const reqId = req.headers["x-request-id"] || nanoid(12);
  req.id = reqId;
  res.setHeader("x-request-id", reqId);
  next();
};
