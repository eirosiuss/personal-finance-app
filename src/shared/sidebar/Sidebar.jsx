const Sidebar = () => {
  return (
    <aside className="sidebar">
      <p>finance logo</p>
      <nav>
        <ul>
          <li>
            <a href="/">Overview</a>
          </li>
          <li>
            <a href="/">Transactions</a>
          </li>
          <li>
            <a href="/">Budgets</a>
          </li>
          <li>
            <a href="/">Pots</a>
          </li>
          <li>
            <a href="/">Recurring Bills</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
