import { useState, useEffect } from "react";
import { useDataStore } from "../../store/dataStore.js";
import Input from "../shared/Input.jsx";
import { Icon } from "@iconify/react";

export default function Transactions() {
  const { fetchTransactions, transactions, error } = useDataStore();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const postsPerPage = 10;
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredTransactions.length / postsPerPage);
  const uniqueCategories = [...new Set(transactions.map((t) => t.category))];
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredTransactions.length / postsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const filterTransactions = (search, category, sort) => {
    let filtered = [...transactions];

    if (search.trim() !== "") {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All Transactions") {
      filtered = filtered.filter((t) => t.category === category);
    }

    switch (sort) {
      case "latest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "a-to-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-to-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "highest":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
    setFilteredTransactions(filtered);
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filterTransactions(value, selectedCategory, selectedSort);
  };

  const [selectedCategory, setSelectedCategory] = useState("All Transactions");
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    filterTransactions(searchValue, value, selectedSort);
  };

  const [selectedSort, setSelectedSort] = useState("latest");
  const handleSort = (e) => {
    const value = e.target.value;
    setSelectedSort(value);
    filterTransactions(searchValue, selectedCategory, value);
  };

  const [showSortingOptions, setShowSortingOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mx-auto px-4">
      <header className="mt-6 mb-8">
        <h1 className="preset-1 text-grey-900 my-2">Transactions</h1>
      </header>

      <div className="bg-white rounded-xl py-6 px-5">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mb-6 flex items-center gap-6"
        >
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center mr-5 text-grey-900">
              <Icon icon="ph:magnifying-glass" width="16" height="16" />
            </span>
            <Input
              type="text"
              placeholder="Search transactions"
              value={searchValue}
              onChange={handleSearch}
            ></Input>
          </div>
          <div>
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            {/* <select
              id="sort"
              name="sort"
              value={selectedSort}
              onChange={handleSort}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="a-to-z">A to Z</option>
              <option value="z-to-a">Z to A</option>
              <option value="highest">Highest</option>
              <option value="lowest">Lowest</option>
            </select> */}
            <button
              onClick={() => setShowSortingOptions(!showSortingOptions)}
              type="button"
            >
              <Icon
                icon="ph:sort-ascending-fill"
                className="text-grey-900"
                width="20"
                height="20"
              />
              {showSortingOptions && (
                <>
                  <div
                    className="fixed inset-0 bg-black/50 z-0"
                    onClick={() => setShowSortingOptions(false)}
                  ></div>

                  <select
                    size={8}
                    id="sort"
                    name="sort"
                    value={selectedSort}
                    onChange={handleSort}
                    className="w-30 px-5 pt-3 absolute left-1/2 -translate-x-1/2 top-28 z-10 bg-white rounded-lg text-grey-900 preset-4"
                  >
                    <option
                      className="border-b border-b-grey-100 pb-3 mb-3"
                      value="latest"
                    >
                      Latest
                    </option>
                    <option
                      className="border-b border-b-grey-100 pb-3 mb-3"
                      value="oldest"
                    >
                      Oldest
                    </option>
                    <option
                      className="border-b border-b-grey-100 pb-3 mb-3"
                      value="a-to-z"
                    >
                      A to Z
                    </option>
                    <option
                      className="border-b border-b-grey-100 pb-3 mb-3"
                      value="z-to-a"
                    >
                      Z to A
                    </option>
                    <option
                      className="border-b border-b-grey-100 pb-3 mb-3"
                      value="highest"
                    >
                      Highest
                    </option>
                    <option value="lowest">Lowest</option>
                  </select>
                </>
              )}
            </button>
          </div>
          <div>
            <label htmlFor="category" className="sr-only">
              Category
            </label>
            {/* <select onChange={handleCategoryChange}>
              <option value="All Transactions">All Transactions</option>
            {uniqueCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
              ))}
              </select> */}
            <button
              onClick={() => setShowCategoryOptions(!showCategoryOptions)}
              type="button"
            >
              <Icon
                className="text-grey-900"
                icon="tabler:filter-filled"
                width="20"
                height="20"
              />
              {showCategoryOptions && (
                <>
                  <div
                    className="fixed inset-0 bg-black/50 z-0"
                    onClick={() => setShowCategoryOptions(false)}
                  ></div>
                  <select value={selectedCategory} size={8} onChange={handleCategoryChange} className="w-fit px-5 pt-3 absolute left-1/2 -translate-x-1/2 top-28 z-10 bg-white rounded-lg text-grey-900 preset-4">
                    <option className="border-b border-b-grey-100 pb-3 mb-3" value="All Transactions">All Transactions</option>
                    {uniqueCategories.map((cat, index) => (
                      <option className="border-b border-b-grey-100 pb-3 mb-3 last:border-b-0 last:mb-0" key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </button>
          </div>
        </form>

        <div>
          <table>
            <thead className="hidden">
              <tr>
                <th>Recipient / Sender</th>
                <th>Category</th>
                <th>Transaction Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>
                    <div>{transaction.name}</div>
                  </td>
                  <td>{transaction.category}</td>
                  <td>
                    {transaction.date.slice(8, 10)}{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                    }).format(new Date(transaction.date))}{" "}
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
      </div>
    </div>
  );
}
