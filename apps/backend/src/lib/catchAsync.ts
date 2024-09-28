import { NextFunction, Request, Response } from "express";
import { UserSession } from "../configs/passport.config.js";

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
declare global {
  namespace Express {
    interface User extends UserSession {}

    interface Request {
      jashan: string;
      user?: Express.User;
    }
  }
}
