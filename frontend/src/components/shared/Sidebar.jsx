import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Icon } from "@iconify/react";
import LogoFinance from "../../../src/assets/images/logo-large.svg";

const Sidebar = () => {
  const { logout } = useAuthStore();
  const hangleLogout = () => {
    logout();
  };

  const SidebarLink = ({ to, icon, label }) => (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={`py-2 px-5 md:px-10 md:pt-3 md:flex md:flex-col  md:justify-between md:items-center lg:py-0 lg:px-0 ${
            isActive
              ? "bg-beige-100 rounded-t-lg border-b-4 border-green lg:rounded-t-none lg:rounded-r-xl lg:border-b-0 lg:border-l-4"
              : "bg-transparent"
          }`}
        >
          <Icon
            icon={icon}
            width="24"
            height="24"
            className={`hover:text-grey-100 md:pb-1 ${
              isActive ? "text-green" : "text-grey-300"
            }`}
          />
          <p
            className={`hidden sm:block text-preset-5-bold text-center ${
              isActive
                ? "bg-beige-100 text-grey-900"
                : "bg-transparent text-grey-300"
            }`}
          >
            {label}
          </p>
        </div>
      )}
    </NavLink>
  );

  return (
    <>
      <nav className="w-full flex fixed bottom-0 bg-grey-900 rounded-t-lg lg:flex lg:flex-col lg:top-0 lg:left-0 lg:h-full lg:w-72">
        <img
          src={LogoFinance}
          alt="Logo Finance"
        />
        <ul className="w-full flex flex-row justify-between items-center pt-2 px-4 md:px-10 lg:flex-col lg:justify-start lg:pt-0 lg:px-0">
          <li className="md:w-[104px] lg:w-full">
            <SidebarLink to="/home-page" icon="mdi-house" label="Overview" />
            <div></div>
          </li>
          <li>
            <SidebarLink
              to="/transactions"
              icon="ph:arrows-down-up"
              label="Transactions"
            />
          </li>
          <li className="md:w-[104px]">
            <SidebarLink
              to="/budgets"
              icon="ph:chart-donut-fill"
              label="Budgets"
            />
          </li>
          <li className="md:w-[104px]">
            <SidebarLink to="/pots" icon="ph:tip-jar-fill" label="Pots" />
          </li>
          {/* <li className="py-2 px-5">
            <NavLink to="/recurring-bills" className={linkClasses}>
              <Icon icon="ph:receipt-fill" width="24" height="24" className="hover:text-grey-100" />
            </NavLink>
          </li> */}
          <li className="py-2 px-5 h-10 md:w-[104px] md:flex md:flex-col md:items-center md:py-0 md:px-10">
            <button
              className="cursor-pointer text-grey-300 hover:text-grey-100"
              onClick={hangleLogout}
            >
              <Icon icon="material-symbols:logout" width="24" height="24" />
            </button>
            <p className="hidden mb-1 md:block text-grey-300 text-preset-5-bold">
              Logout
            </p>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
