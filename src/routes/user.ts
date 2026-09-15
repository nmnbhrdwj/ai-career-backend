import express from "express";
import { loginUser, myProfile, demoLogin } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/demo-login", demoLogin);
router.get("/me", isAuth, myProfile);

export default router;
