import { useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";

export default function DeleteBudget({ onClose, onBudgetDeleted, category }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/budgets/${category}`,
        { method: "DELETE" }
      );

      if (!response.ok)
        throw new Error(`Failed to delete budget: ${response.statusText}`);
      if (onBudgetDeleted) {
        onBudgetDeleted(category);
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
        Are you sure you want to delete the budget for category:{" "}
        <strong>{category}</strong>?
      </p>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </ModalWrapper>
  );
}
