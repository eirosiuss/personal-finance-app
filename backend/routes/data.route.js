import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  transactions,
  budgets,
  pots,
  themes,
  addBudget,
  deleteBudget,
  editBudget,
} from "../controllers/data.controller.js";

const router = express.Router();

router.get("/transactions", verifyToken, transactions);
router.get("/budgets", verifyToken, budgets);
router.get("/pots", verifyToken, pots);
router.get("/themes", verifyToken, themes);

router.post("/add-budget", verifyToken, addBudget);
router.delete("/delete-budget/:category", verifyToken, deleteBudget);
router.put("/edit-budget/:oldCategory", verifyToken, editBudget);

export default router;
