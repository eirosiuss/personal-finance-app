import { Data } from "../models/Data.js";

export const transactions = async (req, res) => {
  try {
    const data = await Data.findOne({ user: req.userId });
    if (!data)
      return res.status(404).json({ message: "Transactions not found" });
    res.status(200).json(data.transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Failed to fetch transactions");
  }
};

export const uploadTransactions = async (req, res) => {
  try {
    const { transactions: uploaded } = req.body;

    if (!Array.isArray(uploaded)) {
      return res
        .status(400)
        .json({ message: "Invalid payload: transactions array is required" });
    }

    const sanitized = uploaded
      .filter((t) => t && typeof t === "object")
      .map((t) => ({
        name: t.name,
        category: t.category,
        date: t.date ? new Date(t.date) : new Date(),
        amount: Number(t.amount),
        recurring: Boolean(t.recurring),
      }))
      .filter((t) =>
        t.name && t.category && !Number.isNaN(t.amount) && t.date instanceof Date
      );

    let data = await Data.findOne({ user: req.userId });
    if (!data) {
      data = new Data({ user: req.userId, transactions: sanitized });
    } else {
      data.transactions.push(...sanitized);
    }

    await data.save();
    res.status(200).json(data.transactions);
  } catch (error) {
    console.error("Error uploading transactions:", error);
    res.status(500).send("Failed to upload transactions");
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

export const themes = async (req, res) => {
  try {
    const availableThemes = [
      { theme: "#277C78", color: "Green" },
      { theme: "#F2CDAC", color: "Yellow" },
      { theme: "#82C9D7", color: "Cyan" },
      { theme: "#626070", color: "Navy" },
      { theme: "#C94736", color: "Red" },
      { theme: "#826CB0", color: "Purple" },
      { theme: "#597C7C", color: "Turquoise" },
      { theme: "#93674F", color: "Brown" },
      { theme: "#934F6F", color: "Magenta" },
      { theme: "#3F82B2", color: "Blue" },
      { theme: "#97A0AC", color: "Grey" },
      { theme: "#7F9161", color: "Army" },
      { theme: "#CAB361", color: "Gold" },
      { theme: "#BE6C49", color: "Orange" }
    ];
    res.status(200).json(availableThemes);
  } catch (error) {
    console.error("Error fetching themes:", error);
    res.status(500).send("Failed to fetch themes");
  }
};

export const addBudget = async (req, res) => {
  try {
    let data = await Data.findOne({ user: req.userId });
    if (!data) {
      data = new Data({ user: req.userId, budgets: [req.body] });
    } else {
      data.budgets.push(req.body);
    }
    await data.save();
    res.status(200).json(data?.budgets);
  } catch (error) {
    console.error("Error adding new budget: ", error);
    res.status(500).send("Failed to add new budget");
  }
};

export const deleteBudget = async (req, res) => {
  const category = req.params.category;
  try {
    const updatedData = await Data.findOneAndUpdate(
      { user: req.userId },
      { $pull: { budgets: { category: category } } },
      { new: true }
    );
    if (!updatedData)
      return res.status(404).json({ message: "Budget not found" });
    res
      .status(200)
      .json({ message: "Budget deleted", budgets: updatedData.budgets });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).send("Failed to delete budget");
  }
};

export const editBudget = async (req, res) => {
  const { newTitle, newMaximum, newTheme } = req.body;
  const { oldCategory } = req.params;

  try {
    const updatedData = await Data.findOneAndUpdate(
      { "budgets.category": oldCategory, user: req.userId },
      {
        $set: {
          "budgets.$.category": newTitle,
          "budgets.$.maximum": newMaximum,
          "budgets.$.theme": newTheme,
        },
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json({
      message: "Budget updated",
      budgets: updatedData.budgets,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).send("Error updating budget");
  }
};
