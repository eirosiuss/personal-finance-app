import data from "../data.json";
import React, { useState } from "react";

function Transactions() {
  const transactions = data.transactions;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(transactions.length / postsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(transactions.length / postsPerPage); i++) {
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

  const [transaction, setTransaction] = useState(transactions);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const filteredTransactions = transactions.filter((transaction) =>
      transaction.name.toLowerCase().includes(value.toLowerCase())
    );
    setTransaction(filteredTransactions);
  };

  return (
    <>
      <header>
        <h1>Transactions</h1>
      </header>

      <input
        type="text"
        placeholder="Search transactions"
        value={searchValue}
        onChange={handleSearch}
      />

      {searchValue.trim() !== "" ? (
        <div className="transactions-container">
          {transaction.map((transaction, index) => (
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
      ) : (
        <div className="transactions-container">
          {currentTransactions.map((transaction, index) => (
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
      )}

      {/* <div className="transactions-container">
        {currentTransactions.map((transaction, index) => (
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
      </div> */}
    </>
  );
}

export default Transactions;
