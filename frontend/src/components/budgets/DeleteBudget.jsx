import ModalWrapper from "../shared/ModalWrapper";

export default function DeleteBudget({ onClose, onBudgetDeleted, budget }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/budgets/${budget.category}`,
        { method: "DELETE" }
      );

      if (!response.ok)
        throw new Error(`Failed to delete budget: ${response.statusText}`);
      if (onBudgetDeleted) {
        onBudgetDeleted(budget.category);
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
        Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.
      </p>
      <button onClick={handleDelete}>Yes, Confirm Deletion</button>
      <button onClick={onClose}>No, Go Back</button>
    </ModalWrapper>
  );
}
