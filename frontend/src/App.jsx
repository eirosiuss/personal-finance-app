import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./components/HomePage.jsx";
import Main from "./components/Main.jsx";
import Profile from "./components/Profile.jsx";

// Import the context provider to manage global user state
import { ProfileProvider } from "./components/ProfileContext.jsx";

function App() {
  return (
    <>
      <Router>
        <ProfileProvider>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </ProfileProvider>
      </Router>
    </>
  );
}

export default App;
