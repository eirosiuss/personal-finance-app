import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { useDataStore } from "../store/dataStore.js";
import formData from "../utils/date.js";

export default function HomePage() {
  const { user } = useAuthStore();
  const {
    fetchTransactions,
    fetchBudgets,
    fetchPots,
    transactions,
    budgets,
    pots,
    error,
  } = useDataStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  useEffect(() => {
    fetchPots();
  }, [fetchPots]);

  const lastFilledTransaction = transactions
    .map((t) => new Date(t.date))
    .sort((a, b) => b - a)[0];
  let lastFilledMonth = lastFilledTransaction?.getMonth();
  let lastFilledYear = lastFilledTransaction?.getFullYear();
  const currentBalance = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const lastMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === lastFilledMonth &&
      date.getFullYear() === lastFilledYear
    );
  });
  const currentMonthIncome = lastMonthTransactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const currentMonthExpances =
    lastMonthTransactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0) * -1;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="financial-summary">
        <header>
          <h1>Finance Overview for {user.name}</h1>
          <p>
            <span>Last Login: </span>
            {formData(user.lastLogin)}
          </p>
        </header>
        <article>
          <h3>Current Balance</h3>
          <p>${currentBalance.toFixed(2)}</p>
        </article>
        <article>
          <h3>Income</h3>
          <p>${currentMonthIncome.toFixed(2)}</p>
        </article>
        <article>
          <h3>Expanses</h3>
          <p>${currentMonthExpances.toFixed(2)}</p>
        </article>
      </div>

      <div className="pots">
        <div className="more-info-header">
          <h2>Pots</h2>
          <Link to="/pots">See Details</Link>
        </div>
        <div>
          <h3>Total Saved</h3>
          {<p>${pots.reduce((acc, pot) => acc + pot.total, 0)}</p>}
        </div>
        {pots.slice(0, 4).map((pot) => (
          <article key={pot._id}>
            <h3>{pot.name}</h3>
            <p>${pot.total}</p>
          </article>
        ))}
      </div>

      <div className="transactions-overview">
        <div className="more-info-header">
          <h2>Transactions</h2>
          <Link to="/transactions">View All</Link>
        </div>
        {transactions.slice(0, 5).map((transaction) => (
          <article key={transaction._id}>
            <div>
              <h3>{transaction.name}</h3>
            </div>
            <div className="transaction-info">
              <p>
                {transaction.amount > 0
                  ? `+$${transaction.amount.toFixed(2)}`
                  : `-$${Math.abs(transaction.amount).toFixed(2)}`}
              </p>
              <p>
                {new Date(transaction.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="budgets">
        <div className="more-info-header">
          <h2>Budgets</h2>
          <Link to="/budgets">See Details</Link>
        </div>
        <p>
          $
          {transactions
            .filter((transaction) => {
              const transactionDate = new Date(transaction.date);
              return (
                [
                  "Entertainment",
                  "Bills",
                  "Dining Out",
                  "Personal Care",
                ].includes(transaction.category) &&
                transaction.amount < 0 &&
                lastFilledYear === transactionDate.getFullYear() &&
                lastFilledMonth === transactionDate.getMonth()
              );
            })
            .reduce((acc, transaction) => acc + transaction.amount, 0)
            .toFixed(2) * -1}
          <span>
            {" "}
            of ${budgets.reduce((acc, budget) => acc + budget.maximum, 0)} limit
          </span>
        </p>
        {budgets.map((budget) => (
          <article key={budget._id}>
            <h3>{budget.category}</h3>
            <p>${budget.maximum.toFixed(2)}</p>
          </article>
        ))}
      </div>

      <div className="recurring-bills">
        <div className="more-info-header">
          <h2>Recurring Bills</h2>
          <Link to="/recurring-bills">See Details</Link>
        </div>
        {transactions
          .filter((transaction) => transaction.recurring)
          .map((transaction) => (
            <article key={transaction._id}>
              <h3>{transaction.name}</h3>
              <p>${transaction.amount.toFixed(2)}</p>
            </article>
          ))}
      </div>
    </>
  );
}
