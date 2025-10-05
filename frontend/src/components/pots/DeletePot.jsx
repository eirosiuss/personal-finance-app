import ModalWrapper from "../shared/ModalWrapper";
import { useDataStore } from "../../store/dataStore";
import { Icon } from "@iconify/react";

export default function DeleteBudget({ onClose, pot }) {
  const { deletePot, fetchPots, error } = useDataStore();

  const handleDelete = async () => {
    try {
      await deletePot(pot.name);
      await fetchPots();
      onClose();
    } catch (error) {
      console.error("Error deleting pot:", error);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex justify-between items-center py-1 mb-5">
        <h2 className="preset-2 text-grey-900">
          Delete &lsquo;{pot.name}&rsquo;?
        </h2>
        <button onClick={onClose}>
          <Icon
            icon="ph:x-circle"
            width="24"
            height="24"
            className="text-grey-500"
          />
        </button>
      </div>
      <p className="preset-4 text-grey-500 mb-5 whitespace-normal">
        Are you sure you want to delete this pot? This action cannot be
        reversed, and all the data inside it will be removed forever.
      </p>
      <button
        onClick={handleDelete}
        className="preset-4-bold text-white bg-red py-4 rounded-lg w-full block"
      >
        Yes, Confirm Deletion
      </button>
      <button
        onClick={onClose}
        className="preset-4 text-grey-500 mt-5 w-full block"
      >
        No, Go Back
      </button>
    </ModalWrapper>
  );
}
