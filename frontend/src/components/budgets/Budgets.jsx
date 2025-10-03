import { useState, useEffect } from "react";
import { useDataStore } from "../../store/dataStore.js";
import AddBudget from "./AddBudget.jsx";
import ModalEditDelete from "../shared/ModalEditDelete.jsx";
import ButtonPrimary from "../shared/ButtonPrimary.jsx"
import { Icon } from "@iconify/react";

export default function Budgets() {
  const {
    fetchBudgets,
    fetchTransactions,
    fetchThemes,
    budgets,
    transactions,
    error,
  } = useDataStore();
  const [showModal, setShowModal] = useState(false);
  const [selectBudget, setSelectBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
    fetchThemes();
  }, [fetchBudgets, fetchTransactions, fetchThemes]);

  const lastFilledTransactionDate = new Date(
    Math.max(...transactions.map((t) => new Date(t.date)))
  );
  const lastFilledMonth = lastFilledTransactionDate.getMonth();
  const lastFilledYear = lastFilledTransactionDate.getFullYear();

  const categories = budgets.map((b) => b.category);
  const totalBudget = budgets.reduce((acc, b) => acc + b.maximum, 0);

  const budgetSpent = budgets.map((budget) => {
    const spent =
      transactions
        .filter(
          (t) =>
            t.category === budget.category &&
            t.amount < 0 &&
            new Date(t.date).getMonth() === lastFilledMonth &&
            new Date(t.date).getFullYear() === lastFilledYear
        )
        .reduce((sum, t) => sum + t.amount, 0) * -1;

    const percentage = totalBudget ? (budget.maximum / totalBudget) * 100 : 0;

    return { ...budget, spent, percentage };
  });

  const spentTotal = budgetSpent.reduce((acc, b) => acc + b.spent, 0);

  function getConicGradient(budgetSpent) {
    let startAngle = 0;
    return budgetSpent
      .map((b) => {
        const endAngle = startAngle + b.percentage * 3.6;
        const grad = `${b.theme} ${startAngle}deg ${endAngle}deg`;
        startAngle = endAngle;
        return grad;
      })
      .join(", ");
  }

  function getInnerGradient(budgetSpent, lightenHex) {
    let startAngle = 0;
    return budgetSpent
      .map((b) => {
        const endAngle = startAngle + b.percentage * 3.6;
        const grad = `${lightenHex(
          b.theme,
          0.5
        )} ${startAngle}deg ${endAngle}deg`;
        startAngle = endAngle;
        return grad;
      })
      .join(", ");
  }

  function lightenHex(hex, percent) {
    let num = parseInt(hex.replace("#", ""), 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;

    r = Math.min(255, Math.floor(r + (255 - r) * percent));
    g = Math.min(255, Math.floor(g + (255 - g) * percent));
    b = Math.min(255, Math.floor(b + (255 - b) * percent));

    return `rgb(${r},${g},${b})`;
  }

  const gradientString = getConicGradient(budgetSpent);
  const innerGradientString = getInnerGradient(budgetSpent, lightenHex);

  function getLatestTransactions(category, count = 3) {
    return transactions
      .filter((t) => t.category === category && t.amount < 0)
      .slice(0, count);
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mx-auto px-4 md:px-10 lg:grid lg:grid-cols-[428px_auto] lg:gap-6 lg:mb-8">
      <header className="mt-6 mb-8 md:mt-8 flex justify-between items-center lg:col-span-2 lg:mb-2">
        <h1 className="preset-1 text-grey-900 my-2">Budgets</h1>
        <>
          <ButtonPrimary
            onClick={() => setShowModal(true)}
          >
            + Add New Budget
          </ButtonPrimary>
          {showModal && (
            <AddBudget
              transactions={transactions}
              categories={categories}
              onClose={() => setShowModal(false)}
              budgets={budgets}
            />
          )}
        </>
      </header>

      <div className="bg-white rounded-xl py-6 md:py-8 md:flex md:items-center md:px-8 md:justify-between lg:flex-col">
        <div className="pt-5 pb-12 md:pb-5 md:flex-1 lg:flex-auto">
          <div className="mx-auto relative w-[240px] h-[240px] rounded-full">
            <div
              className="aspect-square rounded-full"
              style={{ background: `conic-gradient(${gradientString})` }}
            ></div>
            <div
              className="absolute z-10 inset-8 aspect-square rounded-full p-2.5"
              style={{ background: `conic-gradient(${innerGradientString})` }}
            >
              <div className="aspect-square rounded-full bg-white flex items-center justify-center text-center">
                <p className="text-balance text-center preset-1 text-grey-900">
                  ${spentTotal.toFixed(0)}
                  <span className="preset-5 text-grey-500">
                    {" "}
                    of ${totalBudget} limit
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 md:flex-1 md:px-0 lg:flex-auto lg:w-full lg:mt-8">
          <h2 className="preset-2 text-grey-900 pb-6">Spending Summary</h2>
          <div className="divide-y divide-grey-100 lg:flex lg:flex-col lg:justify-between">
            {budgetSpent.map((b) => (
              <article
                key={b._id}
                className="flex justify-between not-last:pb-2 not-first:pt-2"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-1 h-5 rounded-lg"
                    style={{ backgroundColor: b.theme }}
                  ></div>
                  <h3 className="preset-4 text-grey-500">{b.category}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <p className="preset-3 text-grey-900">
                    ${b.spent.toFixed(2)}
                  </p>
                  <p className="preset-5 text-grey-500">
                   of ${b.maximum.toFixed(2)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {budgetSpent.map((b) => {
        const remaining = b.maximum - b.spent;
        const latest = getLatestTransactions(b.category);

        return (
          <div key={b._id} className="py-6 px-5 md:p-8 bg-white rounded-xl my-6 last:mb-19 md:last:mb-28 lg:col-2 lg:my-0 lg:last:mb-0">
            <div className="flex items-center relative">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: b.theme }}
              ></div>
              <h2 className="ml-4 preset-2 text-grey-900">{b.category}</h2>
              <button className="ml-auto" onClick={() => setSelectBudget(b)}>
                <Icon
                  className="text-grey-300"
                  icon="ph:dots-three-outline-fill"
                  width="16"
                  height="16"
                />
              </button>

              {selectBudget?._id === b._id && (
                <ModalEditDelete
                  budget={selectBudget}
                  categories={categories}
                  transactions={transactions}
                  onClose={() => setSelectBudget(null)}
                />
              )}
            </div>

            <div className="flex flex-col gap-4 py-5">
              <p className="preset-4 text-grey-500">
                Maximum of ${b.maximum.toFixed(2)}
              </p>

              <div className="w-full h-8 rounded-sm bg-beige-100 flex">
                <div
                  className="h-6 rounded-sm my-1 mx-1"
                  style={{
                    width: `${Math.min((b.spent / b.maximum) * 100, 100)}%`,
                    backgroundColor: b.theme,
                  }}
                ></div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-4 w-full">
                  <div
                    style={{ backgroundColor: b.theme }}
                    className="h-full w-1 rounded-lg"
                  ></div>
                  <div>
                    <p className="preset-5 text-grey-500">Spent</p>
                    <p className="preset-4-bold text-grey-900">${b.spent.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-4 w-full">
                  <div className="h-full w-1 rounded-lg bg-beige-100"></div>
                  <div>
                    <p className="preset-5 text-grey-500">Remaining</p>
                    <p className="preset-4-bold text-grey-900">${remaining > 0 ? remaining.toFixed(2) : 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-beige-100 p-4 md:p-5 rounded-xl">
              <h3 className="preset-3 text-grey-900 pb-5">Latest Spending</h3>
              {/* task */}
              {/* <p>See All</p> */}
              <div className="flex flex-col divide-y divide-gray-200">
                {latest.map((t) => (
                  <div
                    key={t._id}
                    className="not-last:pb-3 not-first:pt-3 flex justify-between items-center"
                  >
                    <p className="preset-5-bold text-grey-900">{t.name}</p>
                    <div className="transaction-details text-right">
                      <p className="preset-5-bold text-grey-900">
                        {t.amount < 0
                          ? `-$${Math.abs(t.amount).toFixed(2)}`
                          : `+$${t.amount.toFixed(2)}`}
                      </p>
                      <p className="preset-5 text-grey-500">
                        {t.date.slice(8, 10)}{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                        }).format(new Date(t.date))}{" "}
                        {t.date.slice(0, 4)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
