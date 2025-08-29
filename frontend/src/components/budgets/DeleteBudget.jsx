import ModalWrapper from "../shared/ModalWrapper";
import { useDataStore } from "../../store/dataStore";

export default function DeleteBudget({ onClose, onBudgetDeleted, budget }) {
  const { deleteBudget, error } = useDataStore();
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteBudget(budget.category);
      if (onBudgetDeleted) onBudgetDeleted(budget.category);
      onClose();
    } catch (error) {
      console.error(error);
      return;
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ModalWrapper onClose={onClose}>
      <h2>Delete Budget</h2>
      <p>
        Are you sure you want to delete this budget? This action cannot be
        reversed, and all the data inside it will be removed forever.
      </p>
      <button onClick={handleDelete}>Yes, Confirm Deletion</button>
      <button onClick={onClose}>No, Go Back</button>
    </ModalWrapper>
  );
}
