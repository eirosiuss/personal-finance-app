import ModalWrapper from "../shared/ModalWrapper";
import { useDataStore } from "../../store/dataStore";

export default function DeleteBudget({ onClose, budget }) {
  const { deleteBudget, fetchBudgets, error } = useDataStore();
  
  const handleDelete = async () => {
    try {
      await deleteBudget(budget.category);
      await fetchBudgets();
      onClose();
    } catch (error) {
      console.error("Error deleting budget:", error);
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
