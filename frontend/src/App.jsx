import { Routes, Route } from "react-router";
import Login from "./components/pages/Login.jsx";
import SignUp from "./components/pages/SignUp.jsx";
import EmailVerification from "./components/pages/EmailVerification.jsx";
import HomePage from "./components/HomePage.jsx";
import Transactions from "./components/Transactions.jsx";

import MainLayout from "./components/shared/MainLayout.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />}></Route>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<Transactions />}></Route>
        </Route>
      </Routes>
    </>
  );
}
