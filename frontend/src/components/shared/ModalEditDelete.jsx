import { useEffect, useRef, useState } from "react";
import DeleteBudget from "../budgets/DeleteBudget";
import EditBudget from "../budgets/EditBudget";

const ModalEditDelete = ({ budget, categories, transactions, onClose }) => {
  const [mode, setMode] = useState("menu");
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="absolute right-0 top-4 w-34 bg-white rounded-lg py-3 px-5  shadow-2xl z-50 whitespace-nowrap"
    >
      {mode === "menu" && (
        <div className="flex flex-col divide-y divide-grey-100">
          <button
            className="preset-4 text-grey-900 pb-3 text-left "
            onClick={() => setMode("edit")}
          >
            Edit budget
          </button>
          <button
            className="preset-4 text-red pt-3 text-left"
            onClick={() => setMode("confirm-delete")}
          >
            Delete budget
          </button>
        </div>
      )}

      {mode === "edit" && (
        <EditBudget
          budget={budget}
          categories={categories}
          transactions={transactions}
          onClose={onClose}
        />
      )}

      {mode === "confirm-delete" && (
        <DeleteBudget budget={budget} onClose={onClose} />
      )}
    </div>
  );
};

export default ModalEditDelete;
