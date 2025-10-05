import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  transactions,
  uploadTransactions,
  budgets,
  pots,
  addPot,
  themes,
  addBudget,
  deleteBudget,
  editBudget,
  depositToPot,
  withdrawFromPot,
  deletePot
} from "../controllers/data.controller.js";

const router = express.Router();

router.get("/transactions", verifyToken, transactions);
router.post("/transactions/upload", verifyToken, uploadTransactions);


router.get("/budgets", verifyToken, budgets);
router.post("/budgets/add", verifyToken, addBudget);
router.delete("/budgets/delete/:category", verifyToken, deleteBudget);
router.put("/budgets/edit/:oldCategory", verifyToken, editBudget);

router.get("/themes", verifyToken, themes);

router.get("/pots", verifyToken, pots);
router.post("/pots/add", verifyToken, addPot);
router.delete("/pots/delete/:name", verifyToken, deletePot);
router.post("/pots/deposit", verifyToken, depositToPot);
router.post("/pots/withdraw", verifyToken, withdrawFromPot);

export default router;
