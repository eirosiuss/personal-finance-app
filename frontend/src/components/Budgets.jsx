import React, { useEffect } from "react";
import { useState } from "react";
import AddNewBudget from "./budgets/AddNewBudget.jsx";
import DeleteBudget from "./budgets/DeleteBudget.jsx";

export default function Budgets() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const url = import.meta.env.VITE_BACKEND_URL + "/budgets";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setBudgets(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBudgets();
  }, []);

    useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = import.meta.env.VITE_BACKEND_URL + "/transactions";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTransactions();
  }, []);

  if (!budgets || !transactions) return null;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] =
    useState(null);

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

  const handleThemeChange = (color) => {
};

const handleBudgetDeleted = (categoryDeleted) => {
  setBudgets((prevBudgets) => prevBudgets.filter(b => b.category !== categoryDeleted));
};

  return (
    <>
      <header>
        <h1>Budgets</h1>

        <div>
          <button onClick={() => setShowAddModal(true)}>+Add New Budget</button>
          {showAddModal && (
            <AddNewBudget
              transactions={transactions}
              onClose={() => setShowAddModal(false)}
              onBudgetAdded={(newBudget) => {
                setBudgets((prev) => [...prev, newBudget]);
              }}
              onThemeSelect={handleThemeChange}
            ></AddNewBudget>
          )}
        </div>
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
                  <span>{category}${spent.toFixed(2)}</span>
                  <span> of ${budget ? budget.maximum : 0}</span>
                </li>
            );
          })}
          </ul>
        </div>

        {budgets.map((budget, index) => {
          const spent = getSpentForCategory(budget.category);
          const remaining = budget.maximum - spent;

          return (
            <div key={index} className="budget-item">
              <h2>{budget.category}</h2>
              <button
                onClick={() => setSelectedCategoryToDelete(budget.category)}
              >
                Delete Budget
              </button>
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
                  .map((transaction, index) => (
                    <div key={index} className="transaction-item">
                      <div>
                        <div>
                          <img
                            src={`${transaction.avatar.replace(".", "")}`}
                            alt={transaction.name}
                          />
                        </div>
                        <p>{transaction.name}</p>
                      </div>
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

        {selectedCategoryToDelete && (
          <DeleteBudget
          category={selectedCategoryToDelete}
          onClose={() => setSelectedCategoryToDelete(null)}
          onBudgetDeleted={handleBudgetDeleted}
          />
        )}
      </div>
    </>
  );
}
