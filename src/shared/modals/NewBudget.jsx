export default function NewBudget({ onClose, children }) {
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className="modal-container" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        {children}
      </div>
    </div>
  );
}
