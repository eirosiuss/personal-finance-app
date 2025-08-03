import DeleteBudget from "../budgets/DeleteBudget";
import { useState } from "react";
import EditBudget from "../budgets/EditBudget";

const ModalEditDelete = ({
  budget,
  categories,
  onClose,
  onBudgetDeleted,
  transactions,
  onBudgetEdited,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content-edit-delete"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => setShowEdit(true)}>Edit Budget</button>
        {showEdit && (
          <EditBudget
            budget={budget}
            transactions={transactions}
            categories={categories}
            onClose={() => {
              setShowEdit(false);
              onClose();
            }}
            onBudgetEdited={onBudgetEdited}
          />
        )}
        <button onClick={() => setShowDelete(true)}>Delete Budget</button>
        {showDelete && (
          <DeleteBudget
            budget={budget}
            onClose={() => {
              setShowDelete(false);
              onClose();
            }}
            onBudgetDeleted={onBudgetDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default ModalEditDelete;
