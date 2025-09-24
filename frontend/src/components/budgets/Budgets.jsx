import { useState, useEffect } from "react";
import { useDataStore } from "../../store/dataStore.js";
import AddBudget from "./AddBudget.jsx";
import ModalEditDelete from "../shared/ModalEditDelete.jsx";

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

  const categories = budgets.map((budget) => budget.category);

  const totalBudget = budgets.reduce((acc, b) => acc + b.maximum, 0);

  const handleThemeChange = (color) => {};

  function getBudgetPercentages(budgets, transactions, month, year) {
    const totalBudget = budgets.reduce((sum, b) => sum + b.maximum, 0);

    return budgets.map((budget) => {
      const spentAmount =
        transactions
          .filter(
            (t) =>
              t.category === budget.category &&
              t.amount < 0 &&
              new Date(t.date).getMonth() === month &&
              new Date(t.date).getFullYear() === year
          )
          .reduce((sum, t) => sum + t.amount, 0) * -1;

      const percentage = totalBudget ? (budget.maximum / totalBudget) * 100 : 0;

      return { ...budget, percentage, spent: spentAmount };
    });
  }

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

  const budgetSpent = getBudgetPercentages(
    budgets,
    transactions,
    lastFilledMonth,
    lastFilledYear
  );

  const spentTotal = budgets
    .map((budget) => {
      const spentAmount =
        transactions
          .filter(
            (t) =>
              t.category === budget.category &&
              t.amount < 0 &&
              new Date(t.date).getMonth() === lastFilledMonth &&
              new Date(t.date).getFullYear() === lastFilledYear
          )
          .reduce((sum, t) => sum + t.amount, 0) * -1;

      return spentAmount;
    })
    .reduce((acc, val) => acc + val, 0);

  const gradientString = getConicGradient(budgetSpent);
  const innerGradientString = getInnerGradient(budgetSpent, lightenHex);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mx-auto px-4 md:px-10">
      <header className="mt-6 mb-8 md:mt-8 flex justify-between items-center">
        <h1 className="preset-1 text-grey-900 my-2">Budgets</h1>
        <>
          <button
            className="bg-grey-900 preset-4-bold text-white px-4 py-4 rounded-xl cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            + Add New Budget
          </button>
          {showModal && (
            <AddBudget
              transactions={transactions}
              categories={categories}
              onClose={() => setShowModal(false)}
              onThemeSelect={handleThemeChange}
              budgets={budgets}
            ></AddBudget>
          )}
        </>
      </header>
      <div>
        <div className="bg-white rounded-xl py-6">
          <div className="pt-5 pb-12">
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

          <div className="px-5">
            <h2 className="preset-2 text-grey-900 pb-6">Spending Summary</h2>
            <div className="divide-y divide-grey-100">
              {budgets.map((budget) => {
                const spent =
                  budgetSpent.find((b) => b.category === budget.category)
                    ?.spent || 0;

                return (
                  <article key={budget._id} className="flex justify-between not-last:pb-2 not-first:pt-2">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-1 h-5 rounded-lg"
                        style={{ backgroundColor: budget.theme }}
                      ></div>
                      <h3 className="preset-4 text-grey-500">
                        {budget.category}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="preset-3 text-grey-900">${spent.toFixed(2)}</p>
                      <p className="preset-5 text-grey-500">
                        ${budget.maximum.toFixed(2)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {budgets.map((budget) => {
          const spent =
            budgetSpent.find((b) => b.category === budget.category)?.spent || 0;

          const remaining = budget.maximum - spent;

          return (
            <div key={budget._id}>
              <h2>{budget.category}</h2>
              <button onClick={() => setSelectBudget(budget)}>/ / /</button>
              <p>Maximum of ${Number(budget.maximum).toFixed(2)}</p>
              <div className="budget-progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(spent / budget.maximum) * 100}%`,
                    backgroundColor: budget.theme,
                  }}
                ></div>
              </div>
              <div className="budget-progress-text">
                <div className="spent-box">
                  <p>Spent</p>
                  <p>${spent.toFixed(2)}</p>
                </div>
                <div className="remaining-box">
                  <p>Remaining</p>
                  <p>${remaining.toFixed(2) > 0 ? remaining.toFixed(2) : 0}</p>
                </div>
              </div>
              <div className="latest-spending">
                <div>
                  <h3>Latest Spending</h3>
                  <button>See Details</button>
                </div>
                {transactions
                  .filter((t) => t.category === budget.category && t.amount < 0)
                  .slice(0, 3)
                  .map((transaction) => (
                    <div key={transaction._id} className="transaction-item">
                      <p>{transaction.name}</p>
                      <div className="transaction-details">
                        <p>
                          {transaction.amount > 0
                            ? `+$${transaction.amount.toFixed(2)}`
                            : `-$${Math.abs(transaction.amount).toFixed(2)}`}
                        </p>
                        <p>
                          {transaction.date.slice(8, 10)}{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                          }).format(new Date(transaction.date))}{" "}
                          {transaction.date.slice(0, 4)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}

        <>
          {selectBudget && (
            <ModalEditDelete
              transactions={transactions}
              categories={categories}
              budget={selectBudget}
              onClose={() => setSelectBudget(null)}
            ></ModalEditDelete>
          )}
        </>
      </div>
    </div>
  );
}
