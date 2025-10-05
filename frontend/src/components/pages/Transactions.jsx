import { useState, useEffect } from "react";
import { useDataStore } from "../../store/dataStore.js";
import Input from "../shared/Input.jsx";
import ButtonPrimary from "../shared/ButtonPrimary.jsx";
import { Icon } from "@iconify/react";

export default function Transactions() {
  const { fetchTransactions, transactions, uploadTransactions, error } =
    useDataStore();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedFile, setSelectedFile] = useState(null);

  const categorize = (name = "", details = "") => {
    const text = `${name} ${details}`.toLowerCase();

    if (text.includes("arenda") || text.includes("rent")) return "Housing";

    if (
      text.includes("elektrum") ||
      text.includes("ignitis") ||
      text.includes("vandens") ||
      text.includes("vandenys") ||
      text.includes("šilumos") ||
      text.includes("silumos") ||
      text.includes("tele2") ||
      text.includes("plunges bustas")
    )
      return "Utilities";

    if (
      text.includes("maxima") ||
      text.includes("lidl") ||
      text.includes("iki ") ||
      text.includes("iki,") ||
      text.includes("rimi") ||
      text.includes("bites bistro") ||
      text.includes("bistro") ||
      text.includes("vaistine")
    )
      return text.includes("vaistine") ? "Healthcare" : "Food & Groceries";

    if (
      text.includes("judu") ||
      text.includes("viada") ||
      text.includes("ltg link") ||
      text.includes("uber") ||
      text.includes("bolt")
    )
      return "Transportation";

    if (
      text.includes("paskolos") ||
      text.includes("palūkanos") ||
      text.includes("palukanos")
    )
      return "Debt Payments";

    if (text.includes("savings") || text.includes("taup")) return "Savings";

    if (
      text.includes("periodinis investavimas") ||
      text.includes("investav") ||
      text.includes("pensij") ||
      text.includes("fund") ||
      text.includes("robur")
    )
      return "Investments & Retirement";

    if (
      text.includes("vaistine") ||
      text.includes("klinika") ||
      text.includes("medic")
    )
      return "Healthcare";

    if (text.includes("draudim")) return "Insurance";

    if (
      text.includes("pietus") ||
      text.includes("kavine") ||
      text.includes("cafe") ||
      text.includes("restaurant") ||
      text.includes("restoranas")
    )
      return "Dining Out";

    if (
      text.includes("mokykl") ||
      text.includes("university") ||
      text.includes("darzel")
    )
      return "Education & Childcare";

    if (
      text.includes("gimtadienio dovana") ||
      text.includes("gimtadienis") ||
      text.includes("dovana") ||
      text.includes("donation") ||
      text.includes("auka")
    )
      return "Gifts & Donations";

    if (
      text.includes("hotel") ||
      text.includes("booking") ||
      text.includes("airbnb") ||
      text.includes("kelion")
    )
      return "Travel & Vacations";

    if (
      text.includes("aliexpress") ||
      text.includes("gym") ||
      text.includes("sportpoint") ||
      text.includes("contribee")
    )
      return "Personal Spending";

    return "Miscellaneous / Buffer";
  };

  const parseCsv = async (file) => {
    const textRaw = await file.text();
    const text = textRaw.replace(/^\uFEFF/, "");
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length < 2) return [];

    const stripDiacritics = (s) =>
      (s || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const splitRow = (line, d) => {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === d && !inQuotes) {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
      result.push(current);
      return result;
    };

    const candidates = [",", ";", "\t", "|"];
    const delimiter = candidates
      .map((d) => ({
        d,
        c: (lines[0].match(new RegExp(`\\${d}`, "g")) || []).length,
      }))
      .sort((a, b) => b.c - a.c)[0].d;

    const headersRaw = splitRow(lines[0], delimiter);
    const headers = headersRaw.map((h) => stripDiacritics(h));

    const isSwedbankFormat =
      (headers.includes("account no") ||
        headers.includes("sąskaitos nr.") ||
        headers.includes("saskaitos nr.")) &&
      (headers.includes("date") || headers.includes("data")) &&
      (headers.includes("beneficiary") ||
        headers.includes("gavėjas") ||
        headers.includes("gavejas")) &&
      (headers.includes("amount") || headers.includes("suma")) &&
      headers.includes("d/k");

    const amountIdx = (() => {
      let idx = headers.indexOf("amount");
      if (idx < 0) idx = headers.indexOf("suma");
      return idx;
    })();
    const dateIdx = (() => {
      let idx = headers.indexOf("date");
      if (idx < 0) idx = headers.indexOf("data");
      return idx;
    })();
    const categoryIdx = headers.indexOf("category");
    const recurringIdx = headers.indexOf("recurring");
    const recipientIdx = headers.indexOf("recipient");
    const nameIdx = (() => {
      let idx = headers.indexOf("beneficiary");
      if (idx < 0) idx = headers.indexOf("gavejas");
      if (idx < 0) idx = recipientIdx;
      return idx;
    })();
    const detailsIdx = (() => {
      let idx = headers.indexOf("details");
      if (idx < 0) idx = headers.indexOf("paaiskinimai");
      return idx;
    })();
    const dkIdx = headers.indexOf("d/k");

    const headerFailed =
      amountIdx < 0 || dateIdx < 0 || (nameIdx ?? -1) < 0 || dkIdx < 0;
    const positionalFallback = (cols) => ({
      date: cols[2],
      name: cols[3],
      details: cols[4],
      amount: cols[5],
      dk: cols[7],
    });

    const incomeCategories = new Set([
      "salary/income",
      "rental income",
      "pension",
      "gifts",
      "income",
      "salary",
      "interest",
    ]);

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitRow(lines[i], delimiter);
      if (!cols.length) continue;

      if (isSwedbankFormat) {
        const sw =
          headerFailed && cols.length >= 8 ? positionalFallback(cols) : null;
        const rawDate = (sw ? sw.date : cols[dateIdx] || "").trim();
        const rawName = (sw ? sw.name : cols[nameIdx] || "").trim();
        const rawDetails =
          (sw ? sw.details : detailsIdx >= 0 ? cols[detailsIdx] : "")?.trim() ||
          "";
        const rawAmountStr = (
          (sw ? sw.amount : cols[amountIdx]) || "0"
        ).replace(",", ".");
        const dk = ((sw ? sw.dk : cols[dkIdx]) || "").trim().toUpperCase();

        const skipRowText = `${rawName} ${rawDetails}`.toLowerCase();
        if (
          skipRowText.includes("opening balance") ||
          skipRowText.includes("closing balance") ||
          skipRowText.includes("turnover") ||
          skipRowText.includes("likutis pradžiai") ||
          skipRowText.includes("likutis pradziai") ||
          skipRowText.includes("likutis pabaigai") ||
          skipRowText.includes("apyvarta")
        )
          continue;

        const amountNumber = Number(rawAmountStr);
        const signedAmount =
          dk === "K" ? Math.abs(amountNumber) : -Math.abs(amountNumber);
        const isoDate = rawDate
          ? new Date(rawDate).toISOString()
          : new Date().toISOString();
        const category = categorize(rawName, rawDetails);

        parsed.push({
          name: rawName || (rawDetails || "").slice(0, 60) || "Unknown",
          category,
          date: isoDate,
          amount: signedAmount,
          recurring: false,
        });
      } else {
        const rawAmount = (cols[amountIdx] || "0").toString().replace(",", ".");
        const providedCategory = (cols[categoryIdx] || "").trim();
        const amountNumber = Number(rawAmount);
        const rawDate = (cols[dateIdx] || "").trim();
        const isoDate = rawDate
          ? new Date(rawDate).toISOString()
          : new Date().toISOString();
        const name = (cols[recipientIdx] || cols[nameIdx] || "Unknown").trim();
        const details = (cols[detailsIdx] || "").trim();
        const inferredCategory = providedCategory || categorize(name, details);
        const isIncome = incomeCategories.has(
          inferredCategory.trim().toLowerCase()
        );
        const signedAmount = isIncome
          ? Math.abs(amountNumber)
          : -Math.abs(amountNumber);

        parsed.push({
          name,
          category: inferredCategory,
          date: isoDate,
          amount: signedAmount,
          recurring: (cols[recurringIdx] || "").trim().toLowerCase() === "true",
        });
      }
    }
    return parsed.filter((t) => t.name && !Number.isNaN(t.amount));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0] || null);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const parsed = await parseCsv(selectedFile);
    if (!parsed.length) return;
    await uploadTransactions(parsed);
    await fetchTransactions();
    setSelectedFile(null);
  };

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
      <header className="mt-6 mb-8 md:mt-8 flex justify-between items-center lg:col-span-2 lg:mb-2">
        <h1 className="preset-1 text-grey-900 my-2">Transactions</h1>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            className="border border-beige-500 rounded-lg px-3 py-2 text-grey-300 cursor-pointer w-20"
            accept=".csv"
            type="file"
            onChange={handleFileChange}
          />
          <ButtonPrimary
            className="max-w-fit"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload
          </ButtonPrimary>
        </div>
      </header>

      <div className="bg-white rounded-xl py-6 mb-20 px-5 md:px-8 md:py-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center md:gap-6 justify-between"
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
              className="lg:w-80"
            ></Input>
          </div>
          <div className="flex items-center gap-2 md:gap-6 md:justify-between">
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
                      // size={8}
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
                      // size={8}
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
              className="border border-beige-500 rounded-lg px-4 h-10 flex justify-center items-center disabled:opacity-50 disabled:cursor-auto cursor-pointer md:flex md:gap-4"
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
