import { useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";

export default function DeleteBudget({ onClose, onBudgetDeleted, budget }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/budgets/${budget}`,
        { method: "DELETE" }
      );

      if (!response.ok)
        throw new Error(`Failed to delete budget: ${response.statusText}`);
      if (onBudgetDeleted) {
        onBudgetDeleted(budget);
      }
      onClose();
    } catch (err) {
      console.error("Failed to delete budget:", err);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2>Delete Budget</h2>
      <p>
        Are you sure you want to delete the budget for budget:{" "}
        <strong>{budget}</strong>?
      </p>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </ModalWrapper>
  );
}
