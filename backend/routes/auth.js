import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";
const router = express.Router();

router.post("/auth/sign-up", async (req, res) => {
return res.status(501).send('Register not implemented')
})