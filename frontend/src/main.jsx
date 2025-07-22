import * as React from "react";
import * as ReactDOM from "react-dom/client";
import HomePage from "./components/HomePage.jsx";
import Pots from "./components/Pots.jsx";
import Transactions from "./components/Transactions.jsx";
import Budgets from "./components/Budgets.jsx";
import RecurringBills from "./components/RecurringBills.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
    {
    path: "/",
    element: <App />,
    children: [
      {
        path: "transactions",
        element: <Transactions />,
      },
    ],
  },
      {
    path: "/",
    element: <App />,
    children: [
      {
        path: "budgets",
        element: <Budgets />,
      },
    ],
  },
        {
    path: "/",
    element: <App />,
    children: [
      {
        path: "pots",
        element: <Pots />,
      },
    ],
  },
          {
    path: "/",
    element: <App />,
    children: [
      {
        path: "recurring-bills",
        element: <RecurringBills />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        // element: <Record />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        // element: <Record />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);