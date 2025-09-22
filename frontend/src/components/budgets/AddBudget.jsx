import { useState, useRef, useEffect } from "react";
import ModalWrapper from "../shared/ModalWrapper";
import { useDataStore } from "../../store/dataStore";
import { Icon } from "@iconify/react";

export default function AddBudget({
  onClose,
  transactions,
  categories,
  onThemeSelect,
}) {
  const [form, setForm] = useState({
    category: "",
    maximum: "",
    theme: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const { addBudget, fetchThemes, themes, error } = useDataStore();

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const uniqueCategories = [
    ...new Set(transactions.map((t) => t.category)),
    ...categories,
  ];
  const counts = uniqueCategories.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const uniqueCombinedCategories = Object.keys(counts).filter(
    (key) => counts[key] === 1
  );

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
      await addBudget(form);
    } catch (error) {
      console.error(error);
      return;
    }

    setForm({ category: "", maximum: "", theme: "" });
    onClose();
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ModalWrapper onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center py-1 mb-5">
          <h2 className="preset-2 text-grey-900">Add New Budget</h2>
          <button onClick={onClose}>
            <Icon
              icon="ph:x-circle"
              width="24"
              height="24"
              className="text-grey-500"
            />
          </button>
        </div>
        <p className="preset-4 text-grey-500 mb-5">
          Choose a category to set a spending budget. These can help monitor
          spending.
        </p>
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="category" className="preset-5-bold text-grey-500">
            Budget Category
          </label>
          <select
            id="category"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 bg-white"
          >
            {uniqueCombinedCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="maximum" className="preset-5-bold text-grey-500">
            Maximum Spend
          </label>
          <input
            type="number"
            id="maximum"
            name="maximum"
            placeholder="$ e.g. 2000"
            required
            value={form.maximum}
            onChange={handleChange}
            className="preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 bg-white"
          />
        </div>

        <div className="flex flex-col gap-1 mb-5 relative" ref={dropdownRef}>
          <label htmlFor="theme" className="preset-5-bold text-grey-500">
            Theme
          </label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex justify-between items-center preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 bg-white"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: form.theme }}
              ></div>
              <span>
                {themes.find((t) => t.theme === form.theme)?.color ||
                  "Select a theme"}
              </span>
            </div>
            <Icon icon="ph:caret-down-fill" width="11" height="6" />
          </button>
          {isDropdownOpen && (
            <ul className="flex flex-col max-h-72 overflow-y-auto divide-y divide-grey-100 bg-white border-beige-500 border rounded-lg mt-[-5px]">
              {themes.map((theme) => (
                <li
                  key={theme.id}
                  className="flex items-center gap-3 py-3 mx-5"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, theme: theme.theme }));
                    setIsDropdownOpen(false);
                    if (onThemeSelect) onThemeSelect(theme.theme);
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.theme }}
                  ></div>
                  <p className="preset-4 text-grey-900">{theme.color}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <input type="submit" value="Add Budget"></input>
      </form>
    </ModalWrapper>
  );
}
