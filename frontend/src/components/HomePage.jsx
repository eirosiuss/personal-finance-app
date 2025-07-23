import useData from "./hooks/useData.jsx";

export default function HomePage() {
  const {data} = useData();
  if (!data) return null;  
  const { balance, pots, transactions, budgets } = data;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const lastFilledTransaction = transactions
    .map((t) => new Date(t.date))
    .sort((a, b) => b - a)[0];

  const lastFilledMonth = lastFilledTransaction.getMonth();
  const lastFilledYear = lastFilledTransaction.getFullYear();

  return (
    <>
      <div className="financial-summary">
        <header>
          <h1>Overview</h1>
        </header>
        {Object.entries(balance).map(([key, value]) => (
          <article key={key}>
            <h3>
              {key === "current"
                ? `${key.charAt(0).toUpperCase() + key.slice(1)} Balance`
                : `${key.charAt(0).toUpperCase() + key.slice(1)}`}
            </h3>
            <p>${value.toFixed(2)}</p>
          </article>
        ))}
      </div>

      <div className="pots">
        <div className="more-info-header">
          <h2>Pots</h2>
          <button>See Details</button>
        </div>
        <div>
          <h3>Total Saved</h3>
          {<p>${pots.reduce((acc, pot) => acc + pot.total, 0)}</p>}
        </div>
        {pots.slice(0, 4).map((pot, index) => (
          <article key={index}>
            <h3>{pot.name}</h3>
            <p>${pot.total}</p>
          </article>
        ))}
      </div>

      <div className="transactions-overview">
        <div className="more-info-header">
          <h2>Transactions</h2>
          <button>View All</button>
        </div>
        {transactions.slice(0, 5).map((transaction, index) => (
          <article key={index}>
            <div className="transaction-avatar">
              <img
                src={`${transaction.avatar.replace(".", "")}`}
                alt={transaction.name}
              />
              <h3>{transaction.name}</h3>
            </div>
            <div className="transaction-info">
              <p>
                {transaction.amount > 0
                  ? `+$${transaction.amount.toFixed(2)}`
                  : `-$${Math.abs(transaction.amount).toFixed(2)}`}
              </p>
              <p>
                {transaction.date.slice(8, 10)}{" "}
                {months[transaction.date.slice(6, 7) - 1]}{" "}
                {transaction.date.slice(0, 4)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="budgets">
        <div className="more-info-header">
          <h2>Budgets</h2>
          <button>See Details</button>
        </div>
        <p>
          $
          {transactions
            .filter(
              (transaction) =>
                [
                  "Entertainment",
                  "Bills",
                  "Dining Out",
                  "Personal Care",
                ].includes(transaction.category) &&
                transaction.amount < 0 &&
                lastFilledYear == parseInt(transaction.date.slice(0, 4), 10) &&
                lastFilledMonth ==
                  parseInt(transaction.date.slice(5, 7), 10) - 1
            )
            .reduce((acc, transaction) => acc + transaction.amount, 0)
            .toFixed(2) * -1}
          <span>
            {" "}
            of ${budgets.reduce(
              (acc, budget) => acc + budget.maximum,
              0
            )}{" "}
            limit
          </span>
        </p>
        {budgets.map((budget, index) => (
          <article key={index}>
            <h3>{budget.category}</h3>
            <p>${budget.maximum}</p>
          </article>
        ))}
      </div>

      <div className="recurring-bills">
        <div className="more-info-header">
          <h2>Recurring Bills</h2>
          <button>See Details</button>
        </div>
        {transactions
          .filter((transaction) => transaction.recurring)
          .map((transaction, index) => (
            <article key={index}>
              <h3>{transaction.name}</h3>
              <p>${transaction.amount}</p>
            </article>
          ))}
      </div>
    </>
  );
}
