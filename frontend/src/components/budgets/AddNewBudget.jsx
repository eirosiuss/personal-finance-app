import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../shared/ModalWrapper";

export default function AddNewBudget({ onClose, data, onBudgetAdded }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    maximum: "",
    theme: "",
  });

  const uniqueCategories = [
    ...new Set(data.transactions.map((t) => t.category)),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = data?._id;

    try {
      const response = await fetch(`http://localhost:5050/add-budget/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newBudget = await response.json(); // <- gautas naujas biudžetas iš backendo

      if (onBudgetAdded) {
        onBudgetAdded(newBudget); // <- iškviečiame funkciją, perduodame naują biudžetą
      }

    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setForm({ category: "", maximum: "", theme: "" });
      onClose();
      navigate("/budgets");
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
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
          <select
            id="category"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
          >
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
            value={form.maximum}
            onChange={handleChange}
          />
        </div>
        <input type="submit" value="Add Budget"></input>
      </form>
    </ModalWrapper>
  );
}
