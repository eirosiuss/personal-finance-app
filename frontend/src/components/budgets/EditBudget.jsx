import ModalWrapper from "../shared/ModalWrapper";
import { useState, useRef, useEffect } from "react";
import { useDataStore } from "../../store/dataStore";
import { Icon } from "@iconify/react";

export default function EditBudget({
  budget,
  categories,
  onClose,
  transactions,
}) {
  const [form, setForm] = useState({
    category: budget.category,
    maximum: budget.maximum,
    theme: budget.theme,
  });
  const { editBudget, error, budgets, themes } = useDataStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formError, setFormError] = useState({});

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

  const allCategories = [
    ...new Set([...transactions.map((t) => t.category), ...categories]),
  ];

  const existingBudgets = budgets.map((b) => b.category);

  const uniqueCombinedCategories = allCategories.filter(
    (c) => !existingBudgets.includes(c) || c === budget.category
  );

  const usedThemes = budgets.map((budget) => budget.theme);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: null }));

    if (name === "theme" && onThemeSelect) {
      onThemeSelect(value);
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.category) {
      errors.category = "Please select budget category";
    }
    if (!form.maximum) {
      errors.maximum = "Please enter maximum spending";
    }
    if (!form.theme) {
      errors.theme = "Please select color tag";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFormError(errors);
      return;
    }

    try {
      await editBudget(budget.category, {
        newTitle: form.category,
        newMaximum: Number(form.maximum),
        newTheme: form.theme,
      });

      setForm({ category: "", maximum: "", theme: "" });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ModalWrapper onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex justify-between items-center py-1 mb-5">
          <h2 className="preset-2 text-grey-900">Edit Budget</h2>
          <button onClick={onClose}>
            <Icon
              icon="ph:x-circle"
              width="24"
              height="24"
              className="text-grey-500"
            />
          </button>
        </div>
        <p className="preset-4 text-grey-500 mb-5 whitespace-normal">
          As your budgets change, feel free to update your spending limits.
        </p>
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="preset-5-bold text-grey-500">
            Budget Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 bg-white appearance-none cursor-pointer"
            >
              {uniqueCombinedCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Icon
              className="absolute inset-y-0 right-5 my-auto flex items-center pointer-events-none"
              icon="ph:caret-down-fill"
              width="16"
              height="16"
            />
          </div>
          <div className="h-4">
            {formError.category && (
              <p className="text-red-500 preset-4-bold">{formError.category}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="maximum" className="preset-5-bold text-grey-500">
            Maximum Spend
          </label>
          <input
            type="number"
            id="maximum"
            name="maximum"
            placeholder="$ e.g. 2000"
            value={form.maximum}
            onChange={handleChange}
            className="preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 bg-white appearance-none cursor-pointer"
          />
          <div className="h-4">
            {formError.maximum && (
              <p className="text-red-500 preset-4-bold">{formError.maximum}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-1 relative" ref={dropdownRef}>
          <label htmlFor="theme" className="preset-5-bold text-grey-500">
            Color Tag
          </label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex justify-between items-center preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 bg-white cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {form.theme ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: form.theme }}
                  ></div>
                  <span className="preset-4 text-grey-900">
                    {themes.find((t) => t.theme === form.theme)?.color}
                  </span>
                </>
              ) : (
                <span className="text-beige-500">Select color</span>
              )}
            </div>
            <Icon icon="ph:caret-down-fill" width="16" height="16" />
          </button>
          {isDropdownOpen && (
            <ul className="flex flex-col max-h-72 overflow-y-auto divide-y divide-grey-100 bg-white border-beige-500 border rounded-lg mt-[-5px]">
              {themes
                .sort(
                  (a, b) =>
                    usedThemes.includes(b.theme) - usedThemes.includes(a.theme)
                )
                .map((theme) => (
                  <li
                    key={theme._id}
                    className={`flex items-center gap-3 mt-3 pb-3 mx-5 ${
                      usedThemes.includes(theme.theme)
                        ? "opacity-50 cursor-default"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (usedThemes.includes(theme.theme)) return;
                      setForm((prev) => ({ ...prev, theme: theme.theme }));
                      setIsDropdownOpen(false);
                      if (onThemeSelect) onThemeSelect(theme.theme);
                    }}
                  >
                    <div
                      className="min-w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.theme }}
                    ></div>
                    <div className="preset-4 text-grey-900 flex justify-between items-center w-full">
                      <p>{theme.color}</p>
                      {usedThemes.includes(theme.theme) && (
                        <span className="preset-5">Already used</span>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          )}
          <div className="h-4">
            {formError.theme && (
              <p className="text-red-500 preset-4-bold">{formError.theme}</p>
            )}
          </div>
        </div>
        <button
          className="bg-grey-900 text-white preset-4-bold mx-auto block w-full py-4 rounded-lg cursor-pointer"
          type="submit"
        >
          Save Changes
        </button>
      </form>
    </ModalWrapper>
  );
}
