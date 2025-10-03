import { useEffect, useState } from "react";
import { useDataStore } from "../../store/dataStore.js";
import AddPot from "./AddPot.jsx";
import ButtonPrimary from "../shared/ButtonPrimary.jsx";

export default function Pots() {
  const {
    fetchPots,
    fetchThemes,
    pots,
    error,
    depositPot,
    withdrawPot,
  } = useDataStore();
  const [amounts, setAmounts] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPots();
    fetchThemes();
  }, [fetchPots, fetchThemes]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mx-auto px-4 md:px-10 lg:grid lg:grid-cols-[428px_auto] lg:gap-6 lg:mb-8">
      <header className="mt-6 mb-8 md:mt-8 flex justify-between items-center lg:col-span-2 lg:mb-2">
        <h1 className="preset-1 text-grey-900 my-2">Pots</h1>
        <>
          <ButtonPrimary onClick={() => setShowModal(true)}>
            + Add New Pot
          </ButtonPrimary>
          {showModal && (
            <AddPot pots={pots} 
             onClose={() => setShowModal(false)} />
          )}
        </>
      </header>
      {pots.map((pot, index) => (
        <article key={index} className="bg-white rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="preset-3 text-grey-900">{pot.name}</h3>
            <span className="preset-4-bold text-grey-900">
              ${Number(pot.total).toFixed(2)}
            </span>
          </div>
          <div className="w-full h-3 bg-grey-100 rounded">
            <div
              className="h-3 rounded"
              style={{
                width: `${Math.min(
                  (Number(pot.total) / Math.max(Number(pot.target) || 1, 1)) *
                    100,
                  100
                )}%`,
                backgroundColor: pot.theme,
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-grey-500 preset-5">
            <p>
              {Math.min(
                (Number(pot.total) / Math.max(Number(pot.target) || 1, 1)) *
                  100,
                100
              ).toFixed(2)}
              %
            </p>
            <p>Target of ${Number(pot.target).toFixed(2)}</p>
          </div>
          <div className="mt-4 flex gap-3 items-center">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              className="border border-beige-500 rounded-lg px-3 py-2 w-32"
              value={amounts[pot.name] || ""}
              onChange={(e) =>
                setAmounts({ ...amounts, [pot.name]: e.target.value })
              }
            />
            <button
              className="bg-grey-900 preset-4-bold text-white px-4 py-2 rounded-xl cursor-pointer"
              onClick={async () => {
                const value = Number(amounts[pot.name]);
                if (!value || value <= 0) return;
                await depositPot(pot.name, value);
                setAmounts({ ...amounts, [pot.name]: "" });
              }}
            >
              + Add Money
            </button>
            <button
              className="border border-beige-500 preset-4-bold text-grey-900 px-4 py-2 rounded-xl cursor-pointer"
              onClick={async () => {
                const value = Number(amounts[pot.name]);
                if (!value || value <= 0) return;
                await withdrawPot(pot.name, value);
                setAmounts({ ...amounts, [pot.name]: "" });
              }}
            >
              Withdraw
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
