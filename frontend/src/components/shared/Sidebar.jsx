import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <p>finance logo</p>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Overview</NavLink>
          </li>
          <li>
            <NavLink to="/transactions">Transactions</NavLink>
          </li>
          <li>
            <NavLink to="/budgets">Budgets</NavLink>
          </li>
          <li>
            <NavLink to="/pots">Pots</NavLink>
          </li>
          <li>
            <NavLink to="/recurring-bills">Recurring Bills</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
