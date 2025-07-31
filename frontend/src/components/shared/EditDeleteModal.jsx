import AddBudget from "../budgets/AddBudget";
import DeleteBudget from "../budgets/DeleteBudget";
import { useState } from "react";

const ModalEditDelete = ({ transactions,
  onBudgetAdded,
  onThemeSelect,
  budget,
  onClose,
  onBudgetDeleted, }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content-edit-delete"
        onClick={(e) => e.stopPropagation()}
      >
        <button>Edit Budget</button>
        <button onClick={() => setShowModal(true)}>Delete Budget</button>
        {showDelete && (
          <DeleteBudget
            budget={budget}
            onClose={() => {
              setShowDelete(false);
              onClose(); // uždaro ir redagavimo modalą
            }}
            onBudgetDeleted={onBudgetDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default ModalEditDelete;
