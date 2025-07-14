import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <p>finance logo</p>
      <nav>
        <ul>
          <li>
            <Link to="/">Overview</Link>
          </li>
          <li>
            <Link to="/transactions">Transactions</Link>
          </li>
          <li>
            <Link to="/budgets">Budgets</Link>
          </li>
          <li>
            <Link to="/pots">Pots</Link>
          </li>
          <li>
            <Link to="/recurring-bills">Recurring Bills</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
