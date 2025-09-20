import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Icon } from "@iconify/react";
import LogoFinance from "../../../src/assets/images/logo-large.svg";
import LogoFinanceSmall from "../../../src/assets/images/logo-small.svg";

const Sidebar = ({ sidebarMinimized, setSidebarMinimized }) => {
  const { logout } = useAuthStore();
  const hangleLogout = () => {
    logout();
  };

  const SidebarLink = ({ to, icon, label }) => (
    <NavLink to={to} className="group">
      {({ isActive }) => (
        <div
          className={`${
            sidebarMinimized ? "lg:py-4" : "py-2"
          } px-5 md:px-10 md:pt-3 md:flex md:flex-col  md:justify-between md:items-center lg:py-0 lg:px-0 lg:flex-row lg:justify-start lg:items-center lg:gap-4 ${
            isActive
              ? "bg-beige-100 rounded-t-lg border-b-4 border-green group-hover:border-grey-300 lg:rounded-t-none lg:rounded-r-xl lg:border-b-0 lg:border-l-4"
              : "bg-transparent"
          }`}
        >
          <Icon
            icon={icon}
            width="24"
            height="24"
            className={`md:pb-1 lg:pb-0 lg:ml-8 ${
              isActive
                ? "text-green group-hover:text-grey-300"
                : "text-grey-300 group-hover:text-grey-100"
            }`}
          />
          <p
            className={`${
              sidebarMinimized ? "lg:hidden" : ""
            } hidden sm:block preset-5-bold lg:text-preset-3 lg:leading-preset-3 lg:font-preset-3 text-center lg:py-4 ${
              isActive
                ? "bg-beige-100 text-grey-900 group-hover:text-grey-300"
                : "bg-transparent text-grey-300 group-hover:text-grey-100"
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
      <nav
        className={`${
          sidebarMinimized ? "lg:w-[88px]" : "lg:w-[300px]"
        } w-full lg:flex lg:justify-between fixed z-20 bottom-0 bg-grey-900 rounded-t-lg lg:flex-col lg:top-0 lg:left-0 lg:h-full  lg:rounded-t-none lg:rounded-r-2xl lg:transition-all lg:duration-700`}
      >
        <div className="w-full">
          <div className="hidden lg:block py-10 pl-8 pb-16">
            <img
              src={sidebarMinimized ? LogoFinanceSmall : LogoFinance}
              alt="Logo Finance"
            />
          </div>
          <ul
            className={`flex flex-row justify-between items-center pt-2 px-4 md:px-10 lg:flex-col lg:justify-start lg:pt-0 lg:px-0 ${
              sidebarMinimized ? "lg:pr-2" : "lg:pr-6"
            }`}
          >
            <li className="md:w-[104px] lg:w-full">
              <SidebarLink to="/home-page" icon="mdi-house" label="Overview" />
            </li>
            <li className="md:w-[104px] lg:w-full">
              <SidebarLink
                to="/transactions"
                icon="ph:arrows-down-up"
                label="Transactions"
              />
            </li>
            <li className="md:w-[104px] lg:w-full">
              <SidebarLink
                to="/budgets"
                icon="ph:chart-donut-fill"
                label="Budgets"
              />
            </li>
            <li className="md:w-[104px] lg:w-full">
              <SidebarLink to="/pots" icon="ph:tip-jar-fill" label="Pots" />
            </li>
            {/* <li className="py-2 px-5">
            <NavLink to="/recurring-bills" className={linkClasses}>
              <Icon icon="ph:receipt-fill" width="24" height="24" className="hover:text-grey-100" />
            </NavLink>
          </li> */}
            <li
              className="cursor-pointer py-2 px-5 h-10 md:w-[104px] md:flex md:flex-col md:items-center md:py-0 md:px-10 lg:flex-row lg:gap-4 lg:w-full group lg:py-4 lg:px-0 lg:justify-start"
              onClick={hangleLogout}
            >
              <button className="text-grey-300 group-hover:text-grey-100">
                <Icon
                  icon="material-symbols:logout"
                  width="24"
                  height="24"
                  className="group-hover:text-grey-100 lg:ml-8"
                />
              </button>
              <p
                className={`${
                  sidebarMinimized ? "lg:hidden" : ""
                } hidden mb-1 md:block text-grey-300 preset-5-bold lg:text-preset-3 lg:leading-preset-3 lg:font-preset-3 group-hover:text-grey-100`}
              >
                Logout
              </p>
            </li>
          </ul>
        </div>

        {/* task add spin on click */}
        <div
          onClick={() => setSidebarMinimized(!sidebarMinimized)}
          className={`${
            sidebarMinimized ? "rotate" : "rotate"
          } hidden preset-3 mb-16 py-5 lg:flex gap-5 items-center text-grey-300 group hover:grey-100 cursor-pointer`}
        >
          <Icon
            icon={`${
              sidebarMinimized
                ? "ph:arrow-fat-lines-right-fill"
                : "ph:arrow-fat-lines-left-fill"
            }`}
            width="24"
            height="24"
            className="ml-8 group-hover:text-grey-100"
          />
          <button
            className={`preset-3 cursor-pointer group-hover:text-grey-100 ${
              sidebarMinimized ? "lg:hidden" : ""
            }`}
          >
            Minimize Menu
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
