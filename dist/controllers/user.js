import TryCatch from "../middlewares/trycatch.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const DEMO_USER = {
    _id: "650000000000000000000001",
    name: "Demo User",
    email: "demo@careerai.com",
    image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
};
export const emailLogin = TryCatch(async (req, res) => {
    const { email } = req.body || {};
    if (!email || !email.includes("@")) {
        return res.status(400).json({
            message: "Please enter a valid email address",
        });
    }
    const name = email.split("@")[0];
    let user = null;
    try {
        user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                image: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
            });
        }
    }
    catch (err) {
        user = {
            _id: "650000000000000000000001",
            name,
            email,
            image: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        };
    }
    const token = jwt.sign({ _id: user._id }, (process.env.JWT_SEC || "ai_career_secret_jwt_key_2026"), { expiresIn: "15d" });
    return res.json({
        message: `Welcome, ${name}!`,
        token,
        user,
    });
});
export const demoLogin = TryCatch(async (req, res) => {
    let user = DEMO_USER;
    try {
        const existing = await User.findOne({ email: "demo@careerai.com" });
        if (existing) {
            user = existing;
        }
        else {
            user = await User.create(DEMO_USER);
        }
    }
    catch (dbErr) {
        console.log("Database fallback active for demo login");
    }
    const token = jwt.sign({ _id: user._id }, (process.env.JWT_SEC || "ai_career_secret_jwt_key_2026"), { expiresIn: "15d" });
    return res.json({
        message: "Logged in as Demo User",
        token,
        user,
    });
});
export const loginUser = TryCatch(async (req, res) => {
    const { email, code } = req.body || {};
    if (email && email.includes("@")) {
        return emailLogin(req, res, () => { });
    }
    return demoLogin(req, res, () => { });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user || DEMO_USER;
    res.json(user);
});
