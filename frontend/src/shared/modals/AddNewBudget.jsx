export default function AddNewBudget({ onClose, data }) {
  const uniqueCategories = [
    ...new Set(data.transactions.map((t) => t.category)),
  ];

  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className="modal-container" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <form action="" method="post">
          <div className="">
            <h2>Add New Budget</h2>
            <button className="modal-close" onClick={onClose}>
              Close
            </button>
          </div>
          <p>
            Choose a category to set a spending budget. These can help monitor
            spending.
          </p>
          <div className="form-group">
            <label htmlFor="category">Budget Category</label>
            <select id="category" name="category" required>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="maximum">Maximum Spend</label>
            <input
              type="number"
              id="maximum"
              name="maximum"
              placeholder="$ e.g. 2000"
              required
            />
          </div>
          <button>Add Budget</button>
        </form>
      </div>
    </div>
  );
}
