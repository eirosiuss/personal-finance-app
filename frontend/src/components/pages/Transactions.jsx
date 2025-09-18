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
    <div className="mx-auto px-4 md:px-10">
      <header className="mt-6 mb-8 md:mt-8">
        <h1 className="preset-1 text-grey-900 my-2">Transactions</h1>
      </header>

      <div className="bg-white rounded-xl py-6 mb-20 px-5 md:px-8 md:py-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-6"
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
          <div className="md:flex md:items-center md:gap-2">
            <label
              className="sr-only md:not-sr-only md:whitespace-nowrap preset-4 text-grey-500"
              htmlFor="sort"
            >
              Sort by
            </label>
            <select
              id="sort"
              name="sort"
              value={selectedSort}
              onChange={handleSort}
              className="hidden md:block border border-beige-500 px-5 pt-3 rounded-lg text-grey-900 preset-4 md:py-3 md:px-5 md:bg-white"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="a-to-z">A to Z</option>
              <option value="z-to-a">Z to A</option>
              <option value="highest">Highest</option>
              <option value="lowest">Lowest</option>
            </select>
            <button
              onClick={() => setShowSortingOptions(!showSortingOptions)}
              type="button"
              className="md:hidden"
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
          <div className="md:flex md:items-center md:gap-2">
            <label
              htmlFor="category"
              className="sr-only md:not-sr-only preset-4 text-grey-500"
            >
              Category
            </label>
            <select
              onChange={handleCategoryChange}
              className="hidden md:block border border-beige-500 px-5 pt-3 rounded-lg text-grey-900 preset-4 md:py-3 md:px-5 md:bg-white"
            >
              <option value="All Transactions">All Transactions</option>
              {uniqueCategories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowCategoryOptions(!showCategoryOptions)}
              type="button"
              className="md:hidden"
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
                  <select
                    value={selectedCategory}
                    size={8}
                    onChange={handleCategoryChange}
                    className="w-fit px-5 pt-3 absolute left-1/2 -translate-x-1/2 top-28 z-10 bg-white rounded-lg text-grey-900 preset-4"
                  >
                    <option
                      className="border-b border-b-grey-100 pb-3 mb-3"
                      value="All Transactions"
                    >
                      All Transactions
                    </option>
                    {uniqueCategories.map((cat, index) => (
                      <option
                        className="border-b border-b-grey-100 pb-3 mb-3 last:border-b-0 last:mb-0"
                        key={index}
                        value={cat}
                      >
                        {cat}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="w-full">
          <div className="hidden md:grid md:grid-cols-6 border-b border-grey-100 py-4 my-6 text-grey-500 preset-5">
            <p className="md:col-span-3">Recipient / Sender</p>
            <p>Category</p>
            <p className="justify-self-end">
              <span className="block">Transaction</span>
              <span className="block">Date</span>
            </p>
            <p className="justify-self-end">Amount</p>
          </div>
          <div className="w-full my-6 divide-y divide-grey-100">
            {currentTransactions.map((t) => (
              <div
                key={t._id}
                className="w-full grid grid-cols-2 gap-1 not-first:pt-4 not-last:pb-4 md:grid md:grid-cols-6 md:items-center"
              >
                <p className="text-grey-900 preset-4-bold md:col-span-3">
                  {t.name}
                </p>
                <p className="preset-4-bold justify-self-end md:order-4">
                  {t.amount > 0 ? (
                    <span className="text-green">+${t.amount.toFixed(2)}</span>
                  ) : (
                    <span className="text-grey-900">
                      -${Math.abs(t.amount).toFixed(2)}
                    </span>
                  )}
                </p>
                <p className="text-grey-500 preset-5">{t.category}</p>
                <p className="text-grey-500 preset-5 justify-self-end">
                  {t.date.slice(8, 10)}{" "}
                  {new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                    new Date(t.date)
                  )}{" "}
                  {t.date.slice(0, 4)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex pt-6 justify-between items-center">
            <button
              className="border border-beige-500 rounded-lg px-4 h-10 flex justify-center items-center disabled:opacity-50 cursor-pointer md:flex md:gap-4"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <Icon
                className="text-grey-500"
                icon="ph:caret-left-fill"
                width="16"
                height="16"
              />
              <span className="hidden md:block">Previous</span>
            </button>

            <div className="flex gap-2 justify-center">
              {(() => {
                const getPageNumbers = (current, total, isDesktop) => {
                  if (!isDesktop) {
                    let pages = [1];
                    if (current > 1 && current < total) pages.push(current);
                    if (total > 1) pages.push(total);
                    return [...new Set(pages)];
                  }

                  const delta = 2;
                  let start = Math.max(1, current - delta);
                  let end = Math.min(total, current + delta);

                  while (end - start < 4 && (start > 1 || end < total)) {
                    if (start > 1) start--;
                    else if (end < total) end++;
                  }

                  let pages = [];
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  return pages;
                };

                const isDesktop =
                  typeof window !== "undefined" && window.innerWidth >= 768;

                return getPageNumbers(currentPage, totalPages, isDesktop).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={
                        currentPage === num
                          ? "bg-grey-900 text-white w-10 h-10 rounded-lg cursor-pointer"
                          : "border border-beige-500 rounded-lg w-10 h-10 cursor-pointer"
                      }
                    >
                      {num}
                    </button>
                  )
                );
              })()}
            </div>

            <button
              className="border border-beige-500 rounded-lg px-4 h-10 flex justify-center items-center disabled:opacity-50 cursor-pointer md:flex md:gap-4"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <span className="hidden md:block">Next</span>
              <Icon
                className="text-grey-500"
                icon="ph:caret-right-fill"
                width="16"
                height="16"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
