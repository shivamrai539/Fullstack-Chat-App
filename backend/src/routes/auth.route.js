import express from "express";  // It helps you create routes, handle requests, send responses, etc.
import { signup , login, logout , updateProfile, checkAuth } from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();  // Router() creates a mini application inside Express.

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute , updateProfile)

router.get("/check", protectRoute, checkAuth);


export default router;