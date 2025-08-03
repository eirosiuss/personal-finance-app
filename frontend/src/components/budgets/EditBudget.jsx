import ModalWrapper from "../shared/ModalWrapper";
import { useState } from "react";

export default function EditBudget({
  budget,
  onClose,
  transactions,
  onBudgetEdited,
  onThemeSelect,
}) {

  const [form, setForm] = useState({
  category: budget.category,
  maximum: budget.maximum,
  theme: budget.theme
  });
 
  const uniqueCategories = [...new Set(transactions.map((t) => t.category))];

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
        `${import.meta.env.VITE_BACKEND_URL}/budgets/${budget.category}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newTitle: form.category,
            newMaximum: Number(form.maximum),
            newTheme: form.theme,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updated = await response.json();

      if (onBudgetEdited) {
        onBudgetEdited(updated);
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
          <h2>Edit Budget</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <p>As your budgets change, feel free to update your spending limits.</p>
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
        <input type="submit" value="Save changes"></input>
      </form>
    </ModalWrapper>
  );
}
