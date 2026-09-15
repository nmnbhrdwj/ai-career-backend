import axios from "axios";
import { oauth2client } from "../config/googleconfig.js";
import TryCatch from "../middlewares/trycatch.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";

const DEMO_USER = {
  _id: "650000000000000000000001",
  name: "Demo User",
  email: "demo@careerai.com",
  image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
};

export const demoLogin = TryCatch(async (req, res) => {
  let user: any = DEMO_USER;

  try {
    const existing = await User.findOne({ email: "demo@careerai.com" });
    if (existing) {
      user = existing;
    } else {
      user = await User.create(DEMO_USER);
    }
  } catch (dbErr) {
    console.log("Database fallback active for demo login");
  }

  const token = jwt.sign(
    { _id: user._id },
    (process.env.JWT_SEC || "ai_career_secret_jwt_key_2026") as string,
    { expiresIn: "15d" }
  );

  return res.json({
    message: "Logged in as Demo User",
    token,
    user,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  return demoLogin(req, res, () => {});
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user || DEMO_USER;
  res.json(user);
});
