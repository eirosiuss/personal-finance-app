import data from "../data.json";

function Budgets() {
  const transactions = data.transactions;
  const budgets = data.budgets;
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

  return (
    <>
      <header>
        <h1>Budgets</h1>
      </header>
      <div className="budget-container">
        <div className="spending-summary">
          <h2>Spending Summary</h2>
          <p>
            ${totalSpent.toFixed(2)} <span>of ${totalBudget} limit</span>
          </p>
          {categories.map((category) => {
            const budget = budgets.find((b) => b.category === category);
            const spent = getSpentForCategory(category);

            return (
              <ul key={category}>
                <li>
                  <span>{category}</span>${spent.toFixed(2)}
                  <span> of ${budget ? budget.maximum : 0}</span>
                </li>
              </ul>
            );
          })}
        </div>

        {budgets.map((budget) => {
          const spent = getSpentForCategory(budget.category);
          const remaining = budget.maximum - spent;

          return (
            <div key={budget.category} className="budget-item">
              <h2>{budget.category}</h2>
              <p>Maximum of ${budget.maximum.toFixed(2)}</p>
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
                  .filter(
                    (t) =>
                      t.category === budget.category &&
                      t.amount < 0
                  )
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
      </div>
    </>
  );
}

export default Budgets;
