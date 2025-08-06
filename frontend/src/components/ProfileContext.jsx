// Import dependencies
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

// Create the context object
export const ProfileContext = createContext();

// Define the provider component
export const ProfileProvider = ({ children }) => {
  // Store user info in state
  const [ user, setUser ] = useState('');

  // Function to log in a user
  const login = (token) => {
    localStorage.setItem('token', token); // Save token to localStorage
    const decoded = jwtDecode(token); // Decode JWT to get username
    setUser({ user: decoded.username }); // Store username in context state
  };

  // Function to log out a user
  const logout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
  };

  // On initial load, check if there's a token and decode it
  // Persistent login across page refresh
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token); // Decode token on page refresh
      setUser({ user: decoded.username }); // Restore user context state
    }
  }, []);

  // Provide context value to children
  const value = { user, login, logout };

  return (
    <ProfileContext.Provider value={ value }>
      { children }  {/* Render all children inside this provider */}
    </ProfileContext.Provider>
  );
};