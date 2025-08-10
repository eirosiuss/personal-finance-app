import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./db/connection.js";
import authRoutes from "./routes/auth.route.js";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
