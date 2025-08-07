import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connection.js";
import authRoutes from "./routes/auth.js";

const PORT = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

await connectDB();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
