import useData from "./hooks/useData.jsx";
import React, { useState } from "react";

export default function Transactions() {
  const { data } = useData();

  const transactions = React.useMemo(() => data?.transactions || [], [data]);

  const [transaction, setTransaction] = useState(transactions);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  React.useEffect(() => {
    setTransaction(transactions);
  }, [transactions]);

  if (!data) return null;

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentTransactions = transaction.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(transaction.length / postsPerPage);
  const uniqueCategories = [...new Set(transactions.map((t) => t.category))];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setTransaction(transactions);
    } else if (value.trim() !== "") {
      const filteredTransactions = transactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(value.toLowerCase())
      );
      setTransaction(filteredTransactions);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(transaction.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    let sortedTransactions = [...transaction];

    switch (sortValue) {
      case "latest":
        sortedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        sortedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "a-to-z":
        sortedTransactions.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-to-a":
        sortedTransactions.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "highest":
        sortedTransactions.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        sortedTransactions.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
    setTransaction(sortedTransactions);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "All Transactions") {
      setTransaction(transactions);
    } else {
      const filteredTransactions = transactions.filter(
        (transaction) => transaction.category === selectedCategory
      );
      setTransaction(filteredTransactions);
    }
  };
  return (
    <>
      <header>
        <h1>Transactions</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search transactions"
          value={searchValue}
          onChange={handleSearch}
        />
        <label htmlFor="sort">Sort by</label>
        <select id="sort" name="sort" onChange={handleSort}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="a-to-z">A to Z</option>
          <option value="z-to-a">Z to A</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
        <label htmlFor="category">Category</label>
        <select onChange={handleCategoryChange}>
          <option value="All Transactions">All Transactions</option>
          {uniqueCategories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </form>

      <div className="transactions-container">
        <table>
          <thead>
            <tr>
              <th>Recipient / Sender</th>
              <th>Category</th>
              <th>Transaction Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>
                  <div className="transaction-avatar">
                    <img
                      src={`${transaction.avatar.replace(".", "")}`}
                      alt={transaction.name}
                    />
                    {transaction.name}
                  </div>
                </td>
                <td>{transaction.category}</td>
                <td>
                  {transaction.date.slice(8, 10)}{" "}
                  {months[transaction.date.slice(6, 7) - 1]}{" "}
                  {transaction.date.slice(0, 4)}
                </td>
                <td>
                  <p>
                    {transaction.amount > 0
                      ? `+$${transaction.amount.toFixed(2)}`
                      : `-$${Math.abs(transaction.amount).toFixed(2)}`}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div>
            {pageNumbers.map((number) => (
              <button
                className={
                  currentPage === number ? "pagination__btn--active" : ""
                }
                key={number}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
