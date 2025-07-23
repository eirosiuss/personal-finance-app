import { useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";

export default function DeleteBudget({ onClose, data, category }) {
  const handleDelete = async (category) => {
    try {
      const response = await fetch(
        `http://localhost:5050/delete-budget/${data._id}/${category}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete budget");
      onClose();
    } catch (err) {
      console.error("Failed to delete budget:", err);
    }
  };

  return (
    <ModalWrapper onClose={onClose} >
      <button
        onClick={() => handleDelete(category)}
      >
        Delete
      </button>
    </ModalWrapper>
  );
}
