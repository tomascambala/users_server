import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/types";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err: unknown, user: unknown) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user as UserPayload;

    next();
  });
};

export default authenticateToken;
