import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
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

// app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

await connectDB();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
