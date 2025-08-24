import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

const Sidebar = () => {
  const { logout } = useAuthStore();
  const hangleLogout = () => {
    logout();
  };

  return (
    <aside className="sidebar">
      <p>finance logo</p>
      <nav>
        <ul>
          <li>
            <NavLink to="/home-page">Overview</NavLink>
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
          <li>
            <button className="cursor-pointer" onClick={hangleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
