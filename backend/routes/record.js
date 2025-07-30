import express from "express";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /.
const router = express.Router();

const balanceSchema = new mongoose.Schema({
  current: Number,
  income: Number,
  expenses: Number,
});

const transactionSchema = new mongoose.Schema({
  avatar: String,
  name: String,
  category: String,
  date: Date,
  amount: Number,
  recurring: Boolean,
});

const budgetSchema = new mongoose.Schema(
  {
    category: String,
    maximum: Number,
    theme: String,
    _id: { type: ObjectId, default: () => new ObjectId() },
  },
  { _id: true }
);

const potSchema = new mongoose.Schema({
  name: String,
  target: Number,
  total: Number,
  theme: String,
});

const dataSchema = new mongoose.Schema({
  balance: balanceSchema,
  transactions: [transactionSchema],
  budgets: [budgetSchema],
  pots: [potSchema],
});

const Data = model("personal_finance_data", dataSchema);

router.get("/", async (req, res) => {
  try {
    const data = await Data.findOne();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Failed to fetch data");
  }
});

router.get("/budgets", async (req, res) => {
  try {
    const data = await Data.findOne();
    res.status(200).json(data.budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).send("Failed to fetch budgets");
  }
});

router.post('/budgets', async (req, res) => {
  try {
    const newBudget = req.body;
    let data = await Data.findOne();
    if (!data) {
      data = new Data({ budgets: [newBudget] });
      await data.save();
    } else {
      data.budgets.push(newBudget);
      await data.save();
    }
    res.status(201).json(data.budgets);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.delete("/budgets/:category", async (req, res) => {
  const category = req.params.category;

  try {
    const updatedData = await Data.findOneAndUpdate(
      {},
      { $pull: { budgets: { category: category } } },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Data document not found" });
    }

    res.status(200).json({ message: "Budget deleted", budgets: updatedData.budgets });
  } catch (err) {
    console.error("Error deleting budget:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const data = await Data.findOne();
    res.status(200).json(data.transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Failed to fetch transactions");
  }
});

export default router;
