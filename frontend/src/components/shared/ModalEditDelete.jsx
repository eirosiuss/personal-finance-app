import { useEffect, useRef, useState } from "react";
import DeleteBudget from "../budgets/DeleteBudget";
import EditBudget from "../budgets/EditBudget";

const ModalEditDelete = ({ budget, categories, transactions, onClose, children, mode }) => {

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
      {children}

      {mode === "editBudget" && (
        <EditBudget
          budget={budget}
          categories={categories}
          transactions={transactions}
          onClose={onClose}
        />
      )}

      {mode === "deleteBudget" && (
        <DeleteBudget budget={budget} onClose={onClose} />
      )}
    </div>
  );
};

export default ModalEditDelete;
