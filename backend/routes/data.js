import express from "express";
import Data from "../models/Data.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/budgets", protect, async (req, res) => {
  try {
    const data = await Data.findOne({ user: req.user.id });
    if (!data) return res.status(404).json({ message: "No data found" });
    res.status(200).json(data.budgets);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(500).send("Server error");
  }
});

router.post("/budgets", protect, async (req, res) => {
  try {
    let data = await Data.findOne({ user: req.user.id });
    if (!data) {
      data = new Data({ user: req.user.id, budgets: [req.body] });
    } else {
      data.budgets.push(req.body);
    }
    await data.save();
    res.status(201).json(data.budgets);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const data = await Data.findOne();
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).send("Failed to fetch data");
//   }
// });

// router.get("/transactions", async (req, res) => {
//   try {
//     const data = await Data.findOne();
//     res.status(200).json(data.transactions);
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     res.status(500).send("Failed to fetch transactions");
//   }
// });

// router.get("/budgets", async (req, res) => {
//   try {
//     const data = await Data.findOne();
//     res.status(200).json(data.budgets);
//   } catch (error) {
//     console.error("Error fetching budgets:", error);
//     res.status(500).send("Failed to fetch budgets");
//   }
// });

// router.post("/budgets", async (req, res) => {
//   try {
//     const newBudget = req.body;
//     let data = await Data.findOne();
//     if (!data) {
//       data = new Data({ budgets: [newBudget] });
//       await data.save();
//     } else {
//       data.budgets.push(newBudget);
//       await data.save();
//     }
//     res.status(201).json(data.budgets);
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// router.delete("/budgets/:category", async (req, res) => {
//   const category = req.params.category;

//   try {
//     const updatedData = await Data.findOneAndUpdate(
//       {},
//       { $pull: { budgets: { category: category } } },
//       { new: true }
//     );

//     if (!updatedData) {
//       return res.status(404).json({ message: "Data document not found" });
//     }
//     res
//       .status(200)
//       .json({ message: "Budget deleted", budgets: updatedData.budgets });
//   } catch (err) {
//     console.error("Error deleting budget:", err);
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

// router.put("/budgets/:oldCategory", async (req, res) => {
//   const { newTitle, newMaximum, newTheme } = req.body;

//   try {
//     const updatedData = await Data.findOneAndUpdate(
//       { "budgets.category": req.params.oldCategory },
//       {
//         $set: {
//           "budgets.$.category": newTitle,
//           "budgets.$.maximum": newMaximum,
//           "budgets.$.theme": newTheme,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedData) {
//       return res.status(404).json({ message: "Budget not found" });
//     }
//     res.status(200).json({
//       message: "Budget updated",
//       budgets: updatedData.budgets,
//     });
//   } catch (err) {
//     console.error("Error updating budget:", err);
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

// router.get("/pots", async (req, res) => {
//   try {
//     const data = await Data.findOne();
//     res.status(200).json(data.pots);
//   } catch (error) {
//     console.error("Error fetching pots:", error);
//     res.status(500).send("Failed to fetch pots");
//   }
// });

export default router;
