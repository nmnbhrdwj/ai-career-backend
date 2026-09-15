import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/User.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null | any;
}

const DEMO_USER = {
  _id: "650000000000000000000001",
  name: "Demo User",
  email: "demo@careerai.com",
  image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
};

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please Login - No auth header",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Please Login - Token missing",
      });
      return;
    }

    const decodedData = jwt.verify(
      token,
      (process.env.JWT_SEC || "ai_career_secret_jwt_key_2026") as string
    ) as JwtPayload;

    if (!decodedData || !decodedData._id) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    let user: any = null;
    try {
      user = await User.findById(decodedData._id);
    } catch (e) {
      user = DEMO_USER;
    }

    req.user = user || DEMO_USER;
    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(401).json({
      message: "Please Login",
    });
  }
};
