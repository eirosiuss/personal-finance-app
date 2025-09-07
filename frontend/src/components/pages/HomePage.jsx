import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { useDataStore } from "../../store/dataStore.js";
import formData from "../../utils/date.js";
import { Icon } from "@iconify/react";

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
    <div className="px-4 mx-auto">
      <div className="mb-8">
        <header className="mt-6 mb-8">
          <h1 className="preset-1 text-balance">Overview</h1>
          <p className="preset-4 text-balance px-5 py-6 bg-white rounded-xl">
            Welcome back, {user?.name}!
            <span className="block">
              Last Login: {formData(user.lastLogin)}
            </span>
          </p>
        </header>
        <article className="py-5 px-5 mb-3 bg-grey-900 rounded-2xl text-white">
          <h3 className="preset-4">Current Balance</h3>
          <p className="preset-1 pt-3">${currentBalance.toFixed(2)}</p>
        </article>
        <article className="py-5 px-5 mb-3 text-grey-900 rounded-2xl bg-white">
          <h3 className="preset-4 text-grey-500">Income</h3>
          <p className="preset-1 pt-3">${currentMonthIncome.toFixed(2)}</p>
        </article>
        <article className="py-5 px-5 mb-3 text-grey-900 rounded-2xl bg-white">
          <h3 className="preset-4 text-grey-500">Expanses</h3>
          <p className="preset-1 pt-3">${currentMonthExpances.toFixed(2)}</p>
        </article>
      </div>

      <div className="mb-6 px-5 py-6 bg-white rounded-xl">
        <div className="pb-6 flex items-center justify-between">
          <h2 className="preset-2 text-grey-900">Pots</h2>
          <Link
            className="preset-4 flex items-center gap-3 text-grey-500"
            to="/pots"
          >
            See Details
            <Icon icon="tabler:caret-right-filled" width="12" height="12" />
          </Link>
        </div>
        <div className="bg-beige-100">
          <Icon icon="ph:tip-jar-fill"></Icon>
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

      <div className="mb-6 px-5 py-6 bg-white rounded-xl">
        <div className="pb-6 flex items-center justify-between">
          <h2 className="preset-2 text-grey-900">Transactions</h2>
          <Link
            className="preset-4 flex items-center gap-3 text-grey-500"
            to="/transactions"
          >
            View All
            <Icon icon="tabler:caret-right-filled" width="12" height="12" />
          </Link>
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

      <div className="mb-6 px-5 py-6 bg-white rounded-xl">
        <div className="pb-6 flex items-center justify-between">
          <h2 className="preset-2 text-grey-900">Budgets</h2>
          <Link
            className="preset-4 flex items-center gap-3 text-grey-500"
            to="/budgets"
          >
            See Details
            <Icon icon="tabler:caret-right-filled" width="12" height="12" />
          </Link>
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

      <div className="mb-6 px-5 py-6 bg-white rounded-xl">
        <div className="pb-6 flex items-center justify-between">
          <h2 className="preset-2 text-grey-900">Recurring Bills</h2>
          <Link
            className="preset-4 flex items-center gap-3 text-grey-500"
            to="/recurring-bills"
          >
            See Details
            <Icon icon="tabler:caret-right-filled" width="12" height="12" />
          </Link>
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
    </div>
  );
}
