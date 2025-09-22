import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  name: String,
  category: String,
  date: Date,
  amount: Number,
  recurring: Boolean,
});

const budgetSchema = new Schema({
  category: String,
  maximum: Number,
  theme: String,
});

const potSchema = new Schema({
  name: String,
  target: Number,
  total: Number,
  theme: String,
});

const themesSchema = new Schema({
  theme: String,
  color: String,
});

const DataSchema = new Schema({
  transactions: [transactionSchema],
  budgets: [budgetSchema],
  pots: [potSchema],
  themes: [themesSchema],
  user: { type: String, required: true }
});

export const Data = model("Personal_finance_data", DataSchema);