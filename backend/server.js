import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connection.js";
import authRoutes from "./routes/auth.route.js";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); // allows to parse incoming requests:req.body
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(cookieParser()); // allows to parse incoming cookies

app.use("/api/auth", authRoutes);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
