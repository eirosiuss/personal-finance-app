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

export const budgets = async (req, res) => {
  try {
    const data = await Data.findOne({ user: req.userId });
    if (!data) return res.status(404).json({ message: "Budgets not found" });
    res.status(200).json(data.budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).send("Failed to fetch budgets");
  }
};

export const pots = async (req, res) => {
  try {
    const data = await Data.findOne({ user: req.userId });
    if (!data) return res.status(404).json({ message: "Pots not found" });
    res.status(200).json(data?.pots);
  } catch (error) {
    console.error("Error fetching pots:", error);
    res.status(500).send("Failed to fetch pots");
  }
};
