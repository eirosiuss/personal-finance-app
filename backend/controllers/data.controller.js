import { Data } from "../models/Data.js";

export const transactions = async (req, res) => {
  try {
    const data = await Data.findOne({ user: req.userId });
    if (!data) return res.status(404).json({ message: "Transactions not found" });
    res.status(200).json(data.transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Failed to fetch transactions");
  }
};
