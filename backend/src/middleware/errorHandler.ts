import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}
