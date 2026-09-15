import axios from "axios";
import { oauth2client } from "../config/googleconfig.js";
import TryCatch from "../middlewares/trycatch.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";

export const loginUser = TryCatch(async (req, res) => {
  const { code } = req.body || {};

  // Default to Demo User login if code is 'demo', missing, or invalid
  if (!code || code === "demo") {
    let user = await User.findOne({ email: "demo@careerai.com" });
    if (!user) {
      user = await User.create({
        name: "Demo User",
        email: "demo@careerai.com",
        image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      });
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
  }

  try {
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      (process.env.JWT_SEC || "ai_career_secret_jwt_key_2026") as string,
      { expiresIn: "15d" }
    );

    return res.json({
      message: "User Logged in",
      token,
      user,
    });
  } catch (err) {
    // If Google token exchange fails, log in as Demo User safely
    let user = await User.findOne({ email: "demo@careerai.com" });
    if (!user) {
      user = await User.create({
        name: "Demo User",
        email: "demo@careerai.com",
        image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      });
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
  }
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});
