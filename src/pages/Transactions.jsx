import data from "../data.json";

function Transactions() {
  const transactions = data.transactions;

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

  return (
    <>
      <div className="transactions-container">
        {transactions.map((transaction, index) => (
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
    </>
  );
}

export default Transactions;
