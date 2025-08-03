import { useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";

export default function AddBudget({
  onClose,
  transactions,
  categories,
  onBudgetAdded,
  onThemeSelect,
}) {
  const [form, setForm] = useState({
    category: "",
    maximum: "",
    theme: "",
  });

  // const uniqueCategories = [...new Set(transactions.map((t) => t.category))];

    const uniqueCategories = [...new Set(transactions.map((t) => t.category)), ...categories];
  const counts = uniqueCategories.reduce((acc, val) => {
  acc[val] = (acc[val] || 0) + 1;
  return acc;
}, {});

  const uniqueCombinedCategories = Object.keys(counts).filter(
  (key) => counts[key] === 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "theme" && onThemeSelect) {
      onThemeSelect(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/budgets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newBudget = await response.json();

      if (onBudgetAdded) {
        onBudgetAdded(newBudget);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setForm({ category: "", maximum: "", theme: "" });
      onClose();
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>Add New Budget</h2>
          <button onClick={onClose}>
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
            {uniqueCombinedCategories.map((category) => (
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
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: form.theme || "#277C78",
                border: "1px solid #999",
              }}
            ></div>
            <select
              name="theme"
              id="theme"
              required
              value={form.theme}
              onChange={handleChange}
            >
              <option value="#277C78">Green</option>
              <option value="#F2CDAC">Yellow</option>
              <option value="#82C9D7">Cyan</option>
              <option value="#626070">Navy</option>
              <option value="#C94736">Red</option>
              <option value="#826CB0">Purple</option>
              <option value="#597C7C">Turquoise</option>
              <option value="#93674F">Brown</option>
              <option value="#934F6F">Magenta</option>
              <option value="#3F82B2">Blue</option>
              <option value="#97A0AC">Grey</option>
              <option value="#7F9161">Army</option>
              <option value="#CAB361">Gold</option>
              <option value="#BE6C49">Orange</option>
            </select>
          </div>
        </div>
        <input type="submit" value="Add Budget"></input>
      </form>
    </ModalWrapper>
  );
}
