import dotenv from "dotenv";
dotenv.config({ path: "./config.env" }); 
import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT;
const app = express();

app.use(cors({origin: process.env.FRONTEND_URL}));
app.use(express.json());
app.use("/", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});