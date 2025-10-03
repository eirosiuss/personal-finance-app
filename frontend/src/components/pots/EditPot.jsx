import ModalWrapper from "../shared/ModalWrapper";
import { useState, useRef, useEffect } from "react";
import { useDataStore } from "../../store/dataStore";
import { Icon } from "@iconify/react";
import Input from "../shared/Input.jsx"
import ButtonPrimary from "../shared/ButtonPrimary.jsx";

export default function EditBudget({ pot, onClose }) {
  const [form, setForm] = useState({
    name: pot.name,
    target: pot.target,
    theme: pot.theme,
  });
  const { editPot, error, pots, themes } = useDataStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formError, setFormError] = useState({});

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const usedThemes = pots.map((pot) => pot.theme);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name) {
      errors.name = "Please add pot name";
    }
    if (!form.target) {
      errors.target = "Please add target";
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
      await editPot(pot.category, {
        newName: form.name,
        newTarget: Number(form.target),
        newTheme: form.theme,
      });

      setForm({ name: "", target: "", theme: "" });
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
          <h2 className="preset-2 text-grey-900">Edit Pot</h2>
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
          If your saving targets change, feel free to update your pots.
        </p>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="preset-5-bold text-grey-500">
            Pot Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="$ e.g. 2000"
            value={form.name}
            onChange={handleChange}
          />
          <div className="h-4">
            {formError.name && (
              <p className="text-red-500 preset-4-bold">{formError.name}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="target" className="preset-5-bold text-grey-500">
            Target
          </label>
          <Input
            type="number"
            id="target"
            name="target"
            placeholder="$ e.g. 2000"
            value={form.target}
            onChange={handleChange}
          />
          <div className="h-4">
            {formError.target && (
              <p className="text-red-500 preset-4-bold">{formError.target}</p>
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
        <ButtonPrimary
          className="w-full"
          type="submit"
        >
          Save Changes
        </ButtonPrimary>
      </form>
    </ModalWrapper>
  );
}
