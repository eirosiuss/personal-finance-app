import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import EmailVerification from "./components/auth/EmailVerification.jsx";
import MainLayout from "./components/shared/MainLayout.jsx";
import HomePage from "./components/homePage/HomePage.jsx";
import Transactions from "./components/transactions/Transactions.jsx";
import Budgets from "./components/budgets/Budgets.jsx";
import Pots from "./components/pots/Pots.jsx";
import LoadingSpinner from "./components/shared/LoadingSpinner.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import { useAuthStore, useDispatch } from "./context/AuthContext.jsx";
import { useEffect } from "react";

import axios from "axios";
const API_URL =
  import.meta.env.MODE === "development"
    ? `${import.meta.env.VITE_BACKEND_URL}/api/auth`
    : "/api/auth";
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!authStore.user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated && authStore.user.isVerified) {
    return <Navigate to="/home-page" replace />;
  }
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/check-auth`);
        dispatch({
          type: "checked_auth",
          user: response.data.user,
          isCheckingAuth: false,
          isAuthenticated: true,
        });
      } catch (error) {
        dispatch({
          type: "checked_auth",
          user: null,
          isCheckingAuth: false,
          isAuthenticated: false,
        });
      }
    };
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route
        path="/signup"
        element={
          <RedirectAuthenticatedUser>
            <SignUp />
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectAuthenticatedUser>
            <Login />
          </RedirectAuthenticatedUser>
        }
      />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route
        path="/forgot-password"
        element={
          <RedirectAuthenticatedUser>
            <ForgotPassword />
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <RedirectAuthenticatedUser>
            <ResetPassword />
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/home-page" replace />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/transactions" element={<Transactions />}></Route>
        <Route path="/budgets" element={<Budgets />}></Route>
        <Route path="/pots" element={<Pots />}></Route>
        <Route path="*" element={<Navigate to="/home-page" replace />} />
      </Route>
    </Routes>
  );
}
