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
    const data = await Data.findOne({ user: req.userId });
    if (!data) return res.status(404).json({ message: "Themes not found" });
    res.status(200).json(data.themes);
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
