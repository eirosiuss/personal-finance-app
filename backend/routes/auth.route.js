import express from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signup", signup)
router.get("/login", login)
router.get("/logout", logout)

export default router;