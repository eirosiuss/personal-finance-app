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

  const totalBudget = budgets.reduce((sum, b) => sum + b.maximum, 0);

  const budgetSpent = budgets.map((budget) => {
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

    const percentage = totalBudget ? (spentAmount / totalBudget) * 100 : 0;
    return { ...budget, spent: spentAmount, percentage };
  });

  const colors = budgets.map((b) => b.theme);

  const gradientString = budgetSpent
    .map((b, i) => {
      const start = budgetSpent
        .slice(0, i)
        .reduce((acc, prev) => acc + prev.percentage, 0);
      const end = start + b.percentage;
      return `${colors[i % colors.length]} ${start * 3.6}deg ${end * 3.6}deg`;
    })
    .join(", ");

  const spentTotal = budgetSpent.reduce((acc, b) => acc + b.spent, 0);

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

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="px-4 mx-auto my-6 md:px-10 md:my-8">
      <div className="mb-8">
        <header className="mb-8">
          <h1 className="preset-1 text-balance mb-8">Overview</h1>
          <p className="preset-4 text-balance px-5 py-6 bg-white rounded-xl w-fit">
            Welcome back, {user?.name}!
            <span className="block">
              Last Login: {formData(user.lastLogin)}
            </span>
          </p>
        </header>
        <div className="mb-3 md:flex md:gap-6">
          <article className="py-5 px-5 mb-3 md:mb-0 md:w-full bg-grey-900 rounded-2xl text-white">
            <h3 className="preset-4">Current Balance</h3>
            <p className="preset-1 pt-3">${currentBalance.toFixed(2)}</p>
          </article>
          <article className="py-5 px-5 mb-3 md:mb-0 md:w-full text-grey-900 rounded-2xl bg-white">
            <h3 className="preset-4 text-grey-500">Income</h3>
            <p className="preset-1 pt-3">${currentMonthIncome.toFixed(2)}</p>
          </article>
          <article className="py-5 px-5 mb-3 md:mb-0 md:w-full text-grey-900 rounded-2xl bg-white">
            <h3 className="preset-4 text-grey-500">Expanses</h3>
            <p className="preset-1 pt-3">${currentMonthExpances.toFixed(2)}</p>
          </article>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div>
          <div className="mb-6 px-5 py-6 md:py-8 bg-white rounded-xl md:px-8 ">
            <div className="pb-5 flex items-center justify-between">
              <h2 className="preset-2 text-grey-900">Pots</h2>
              <Link
                className="preset-4 flex items-center gap-3 text-grey-500"
                to="/pots"
              >
                See Details
                <Icon icon="tabler:caret-right-filled" width="12" height="12" />
              </Link>
            </div>
            <div className="md:flex md:gap-5">
              <div className="bg-beige-100 flex items-center gap-4 rounded-xl md:w-full">
                <Icon
                  icon="ph:tip-jar"
                  width="40"
                  height="40"
                  className="text-green ml-4"
                ></Icon>
                <div className="py-5">
                  <h3 className="text-grey-500 preset-4 mb-2.5">Total Saved</h3>
                  {
                    <p className="text-grey-900 preset-1">
                      ${pots.reduce((acc, pot) => acc + pot.total, 0)}
                    </p>
                  }
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 md:w-full md:mt-0">
                {pots.slice(0, 4).map((pot, index) => {
                  const borderColors = [
                    "bg-green",
                    "bg-navy",
                    "bg-cyan",
                    "bg-yellow",
                  ];
                  return (
                    <article key={pot._id} className="flex gap-4 items-center">
                      <div
                        className={`w-1 h-full rounded-xl ${
                          borderColors[index] || ""
                        }`}
                      ></div>
                      <div>
                        <h3 className="mb-1 text-grey-500 preset-5">
                          {pot.name}
                        </h3>
                        <p className="text-grey-900 preset-4-bold">
                          ${pot.total}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-6 px-5 py-6 bg-white rounded-xl md:px-8 lg:mb-0">
            <div className="pb-8 flex items-center justify-between">
              <h2 className="preset-2 text-grey-900">Transactions</h2>
              <Link
                className="preset-4 flex items-center gap-3 text-grey-500"
                to="/transactions"
              >
                View All
                <Icon icon="tabler:caret-right-filled" width="12" height="12" />
              </Link>
            </div>
            {transactions.slice(0, 5).map((transaction, index, arr) => (
              <article
                key={transaction._id}
                className={`flex justify-between items-center ${
                  index !== arr.length - 1
                    ? "border-b border-b-grey-100 mb-5 pb-5"
                    : ""
                }`}
              >
                <h3 className="preset-4-bold text-grey-900">
                  {transaction.name}
                </h3>

                <div className="text-right">
                  <p
                    className={`${
                      transaction.amount > 0
                        ? "preset-4-bold text-green"
                        : "preset-4-bold text-grey-900"
                    }`}
                  >
                    {transaction.amount > 0
                      ? `+$${transaction.amount.toFixed(2)}`
                      : `-$${Math.abs(transaction.amount).toFixed(2)}`}
                  </p>
                  <p className="preset-5 text-grey-500">
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
        </div>

        <div className="mb-20 px-5 py-6 bg-white rounded-xl md:px-8 md:mb-24 lg:mb-0 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="preset-2 text-grey-900">Budgets</h2>
            <Link
              className="preset-4 flex items-center gap-3 text-grey-500"
              to="/budgets"
            >
              See Details
              <Icon icon="tabler:caret-right-filled" width="12" height="12" />
            </Link>
          </div>
          <div className="mt-7 md:mt-12 md:flex md:gap-4">
            <div className="mx-auto relative w-[240px] rounded-full">
              <div
                className="aspect-square rounded-full"
                style={{ background: `conic-gradient(${gradientString})` }}
              ></div>
              <div
                className="absolute z-10 inset-1/8 aspect-square rounded-full p-2.5"
                style={{
                  background: `conic-gradient(${budgetSpent
                    .map((b, i) => {
                      const start = budgetSpent
                        .slice(0, i)
                        .reduce((acc, prev) => acc + prev.percentage, 0);
                      const end = start + b.percentage;
                      const color = colors[i % colors.length];
                      const lightColor = lightenHex(color, 0.5);
                      return `${lightColor} ${start * 3.6}deg ${end * 3.6}deg`;
                    })
                    .join(", ")})`,
                }}
              >
                <div className="aspect-square rounded-full bg-white flex items-center justify-center text-center">
                  <p className="text-balance preset-1 text-grey-900">
                    ${spentTotal.toFixed(0)}
                    <span className="preset-5 text-grey-500">
                      {" "}
                      of ${totalBudget} limit
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-4 mb-2 gap-4 md:mt-0 md:mb-0 md:py-2.5 md:grid-cols-1">
              {budgets.map((budget) => (
                <article key={budget._id} className="flex gap-4">
                  <div
                    className="w-2 rounded-xl"
                    style={{ backgroundColor: budget.theme }}
                  ></div>
                  <div>
                    <h3 className="preset-5 text-grey-500">
                      {budget.category}
                    </h3>
                    <p className="preset-4-bold text-grey-900">
                      ${budget.maximum.toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mb-6 px-5 py-6 bg-white rounded-xl">
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
      </div> */}
    </div>
  );
}
