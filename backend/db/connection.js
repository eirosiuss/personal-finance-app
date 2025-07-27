import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.VITE_BACKEND_URL)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Cannot connect to MongoDB'))
db.once('open', () => console.log('Connected successfully to MongoDB'))

export default db;