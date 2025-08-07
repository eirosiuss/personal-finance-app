import mongoose from "mongoose";

const { Schema, model } = mongoose;

const balanceSchema = new Schema({
  current: Number,
  income: Number,
  expenses: Number,
});

const transactionSchema = new Schema({
  avatar: String,
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

const dataSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: balanceSchema,
  transactions: [transactionSchema],
  budgets: [budgetSchema],
  pots: [potSchema],
});

const Data = model("Data", dataSchema);
export default Data;
