import { useEffect, useState } from "react";
import { useDataStore } from "../../store/dataStore.js";
import AddPot from "./AddPot.jsx";
import ButtonPrimary from "../shared/ButtonPrimary.jsx";
import ButtonSecondary from "../shared/ButtonSecondary.jsx";
import { Icon } from "@iconify/react";
import ModalEditDelete from "../shared/ModalEditDelete.jsx";
import Input from "../shared/Input.jsx";
import Header from "../shared/Header.jsx";

export default function Pots() {
  const { fetchPots, fetchThemes, pots, error, depositPot, withdrawPot } =
    useDataStore();
  const [amounts, setAmounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectPot, setSelectPot] = useState(null);
  const [mode, setMode] = useState("menu");

  useEffect(() => {
    fetchPots();
    fetchThemes();
  }, [fetchPots, fetchThemes]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mx-auto px-4 md:px-10 lg:grid lg:grid-cols-2 lg:gap-6 lg:mb-8">
      <header className="mt-6 mb-8 md:mt-8 flex justify-between items-center lg:col-span-2 lg:mb-2">
        <Header className="my-2" title="Pots"></Header>
        <>
          <ButtonPrimary
            className="max-w-fit"
            onClick={() => setShowModal(true)}
          >
            + Add New Pot
          </ButtonPrimary>
          {showModal && (
            <AddPot pots={pots} onClose={() => setShowModal(false)} />
          )}
        </>
      </header>
      {pots.map((pot) => (
        <article
          key={pot._id}
          className="py-6 px-5 md:p-8 bg-white rounded-xl my-6 last:mb-19 md:last:mb-28 lg:my-0 lg:last:mb-0"
        >
          <div className="flex items-center relative mb-10">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: pot.theme }}
            ></div>
            <h3 className="ml-4 preset-2 text-grey-900">{pot.name}</h3>
            <button className="ml-auto" onClick={() => setSelectPot(pot)}>
              <Icon
                className="text-grey-300"
                icon="ph:dots-three-outline-fill"
                width="16"
                height="16"
              />
            </button>
            {selectPot?._id === pot._id && (
              <ModalEditDelete
                pot={selectPot}
                onClose={() => {
                  setSelectPot(null);
                  setMode("menu");
                }}
                mode={mode}
                setMode={setMode}
              >
                <div className="flex flex-col divide-y divide-grey-100">
                  <button
                    className="preset-4 text-grey-900 pb-3 text-left "
                    onClick={() => setMode("editPot")}
                  >
                    Edit pot
                  </button>
                  <button
                    className="preset-4 text-red pt-3 text-left"
                    onClick={() => setMode("deletePot")}
                  >
                    Delete pot
                  </button>
                </div>
              </ModalEditDelete>
            )}
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="preset-4 text-grey-500">Total Saved</p>
            <p className="preset-1 text-grey-900">
              ${(Number(pot.total) || 0).toFixed(2)}
            </p>
          </div>
          <div className="w-full h-2 bg-beige-100 rounded mb-3">
            <div
              className="h-2 rounded"
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
          <div className="flex items-center justify-between text-grey-500 mb-8">
            <p className="preset-5-bold">
              {Math.min(
                ((Number(pot.total) || 0) /
                  Math.max(Number(pot.target) || 1, 1)) *
                  100,
                100
              ).toFixed(2)}
              %
            </p>
            <p className="preset-5">
              Target of ${Number(pot.target).toFixed(2)}
            </p>
          </div>
          <Input
            noValidate
            type="number"
            placeholder="Amount"
            value={amounts[pot.name] || ""}
            onChange={(e) =>
              setAmounts({ ...amounts, [pot.name]: e.target.value })
            }
          />
          <div className="flex items-center justify-between mt-4 mb-3.5 gap-4">
            <ButtonSecondary
              onClick={async () => {
                const value = Number(amounts[pot.name]);
                if (!value || value <= 0) return;
                await depositPot(pot.name, value);
                setAmounts({ ...amounts, [pot.name]: "" });
              }}
            >
              + Add Money
            </ButtonSecondary>
            <ButtonSecondary
              onClick={async () => {
                const value = Number(amounts[pot.name]);
                if (!value || value <= 0) return;
                await withdrawPot(pot.name, value);
                setAmounts({ ...amounts, [pot.name]: "" });
              }}
            >
              Withdraw
            </ButtonSecondary>
          </div>
        </article>
      ))}
    </div>
  );
}
