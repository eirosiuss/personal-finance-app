import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import HomePage from "./HomePage.jsx";
import Pots from "./Pots.jsx";
import Transactions from "./Transactions.jsx";
import Budgets from "./budgets/Budgets.jsx";
import RecurringBills from "./RecurringBills.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import MainLayout from "./shared/MainLayout.jsx";

const router = createBrowserRouter([
  {
    element: (
      <RequireAuth loginPath="/login">
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "transactions", element: <Transactions /> },
      { path: "budgets", element: <Budgets /> },
      { path: "pots", element: <Pots /> },
      { path: "recurring-bills", element: <RecurringBills /> },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
