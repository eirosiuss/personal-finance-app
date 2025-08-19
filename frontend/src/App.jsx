import { Routes, Route } from "react-router";
import { Navigate } from "react-router-dom";
import Login from "./components/pages/Login.jsx";
import SignUp from "./components/pages/SignUp.jsx";
import EmailVerification from "./components/pages/EmailVerification.jsx";
import HomePage from "./components/HomePage.jsx";
import Transactions from "./components/Transactions.jsx";
import MainLayout from "./components/shared/MainLayout.jsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/authStore.js";
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
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/home-page"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/transactions" element={<ProtectedRoute>
                <Transactions />
              </ProtectedRoute>}></Route>
        </Route>
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
        <Route path="/verify-email" element={<EmailVerification />}></Route>
      </Routes>
      <Toaster />
    </>
  );
}
