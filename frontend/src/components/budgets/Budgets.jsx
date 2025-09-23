import { useState, useEffect } from "react";
import { useDataStore } from "../../store/dataStore.js";
import AddBudget from "./AddBudget.jsx";
import ModalEditDelete from "../shared/ModalEditDelete.jsx";

export default function Budgets() {
  const { fetchBudgets, fetchTransactions, fetchThemes, budgets, transactions, error } =
    useDataStore();
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

  const getSpentForCategory = (category) => {
    return (
      transactions
        .filter(
          (t) =>
            t.category === category &&
            t.amount < 0 &&
            new Date(t.date).getFullYear() === lastFilledYear &&
            new Date(t.date).getMonth() === lastFilledMonth
        )
        .reduce((sum, t) => sum + t.amount, 0) * -1
    );
  };

  const totalSpent = categories.reduce(
    (acc, cat) => acc + getSpentForCategory(cat),
    0
  );

  const totalBudget = budgets.reduce((acc, b) => acc + b.maximum, 0);

  const handleThemeChange = (color) => {};

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mx-auto px-4 md:px-10">
      <header className="mt-6 mb-8 md:mt-8 flex justify-between items-center">
        <h1 className="preset-1 text-grey-900 my-2">Budgets</h1>
        <>
          <button
            className="bg-grey-900 preset-4-bold text-white px-4 py-4 rounded-xl"
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
      <div className="budget-container">
        <div className="spending-summary">
          <h2>Spending Summary</h2>
          <p>
            ${totalSpent.toFixed(2)} <span>of ${totalBudget} limit</span>
          </p>
          <ul>
            {categories.map((category, index) => {
              const budget = budgets.find((b) => b.category === category);
              const spent = getSpentForCategory(category);

              return (
                <li key={index}>
                  <span>
                    {category}${spent.toFixed(2)}
                  </span>
                  <span> of ${budget ? budget.maximum : 0}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {budgets.map((budget) => {
          const spent = getSpentForCategory(budget.category);
          const remaining = budget.maximum - spent;

          return (
            <div key={budget._id} className="budget-item">
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
