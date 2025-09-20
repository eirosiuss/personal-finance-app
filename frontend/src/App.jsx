import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/Login.jsx";
import SignUp from "./components/pages/SignUp.jsx";
import EmailVerification from "./components/pages/EmailVerification.jsx";
import MainLayout from "./components/shared/MainLayout.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import Transactions from "./components/pages/Transactions.jsx";
import Budgets from "./components/budgets/Budgets.jsx";
import Pots from "./components/pages/Pots.jsx";
import LoadingSpinner from "./components/shared/LoadingSpinner.jsx";
import ForgotPassword from "./components/pages/ForgotPassword.jsx";
import ResetPassword from "./components/pages/ResetPassword.jsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";

//protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

//redirect authenticated users to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/home-page" replace />;
  }
  return children;
};

export default function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
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
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
