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

router.get("/budgets/:id", async (req, res) => {
  try {
    // res.send("Budget ID: " + req.params.id);
    const budget = await Data.findById(req.params.id);
    return res.send(budget);
  } catch (error) {
    console.error("Error fetching specific budget:", error);
    res.status(500).send("Failed to fetch budget");
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

// This section will help you get a single record by id
// router.get("/:id", async (req, res) => {
//   let collection = await db.collection("personal_finance_data");
//   let query = { _id: new ObjectId(req.params.id) };
//   let result = await collection.findOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.status(200).send(result);
// });

// This section will create a new budget.
// router.post("/add-budget/:id", async (req, res) => {
//   const { category, maximum, theme } = req.body;
//   const userId = req.params.id;

//   try {
//     const result = await db.collection("personal_finance_data").updateOne(
//       { _id: new ObjectId(userId) },
//       {
//         $push: {
//           budgets: {
//             category,
//             maximum: Number(maximum),
//             theme,
//           },
//         },
//       }
//     );

//     res.status(200).send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to add budget");
//   }
// });

// This section will help you update a record by id.
// router.patch("/:id", async (req, res) => {
//   try {
//     const query = { _id: new ObjectId(req.params.id) };
//     const updates = {
//       $set: {
//         name: req.body.name,
//         position: req.body.position,
//         level: req.body.level,
//       },
//     };

//     let collection = await db.collection("personal_finance_data");
//     let result = await collection.updateOne(query, updates);
//     res.status(200).send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating record");
//   }
// });

// This section will delete a budget
// router.delete("/delete-budget/:id/:category", async (req, res) => {
//   const userId = req.params.id;
//   const categoryToDelete = req.params.category;

//   try {
//     const result = await db
//       .collection("personal_finance_data")
//       .updateOne(
//         { _id: new ObjectId(userId) },
//         { $pull: { budgets: { category: categoryToDelete } } }
//       );

//     res.status(200).send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to delete budget");
//   }
// });

export default router;
