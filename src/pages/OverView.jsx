import data from "../data.json";

const Overview = () => {
  const balance = data.balance;
  const pots = data.pots;
  const transactions = data.transactions;
  let months = [
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

  return (
    <>
      <div className="financial-summary">
        <h1>Overview</h1>
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
        <div className="pots-header">
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
      <div className="transactions">
        <div className="transactions-header">
          <h2>Transactions</h2>
          <button>View All</button>
        </div>
        {transactions.slice(0, 5).map((transaction, index) => (
          <article key={index}>
            <div className="transaction-avatar">
              <img
                src={`/public${transaction.avatar.replace(".", "")}`}
                alt={transaction.name}
              />
              <h3>{transaction.name}</h3>
            </div>
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
          </article>
        ))}
      </div>
    </>
  );
};

export default Overview;
