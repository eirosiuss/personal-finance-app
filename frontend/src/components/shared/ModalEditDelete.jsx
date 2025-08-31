import DeleteBudget from "../budgets/DeleteBudget";
import { useState } from "react";
import EditBudget from "../budgets/EditBudget";

const ModalEditDelete = ({
  budget,
  categories,
  onClose,
  transactions,
  onThemeSelect,
}) => {
  const [mode, setMode] = useState("menu");

  return (
    <div onClose={onClose}>
      {mode === "menu" && (
        <div>
          <button className="cursor-pointer" onClick={() => setMode("edit")}>
            Edit budget
          </button>
          <button
            className="cursor-pointer"
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
          onThemeSelect={onThemeSelect}
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
