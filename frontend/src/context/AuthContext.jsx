import { createContext, useContext, useReducer } from "react";
import axios from "axios";
const API_URL =
  import.meta.env.MODE === "development"
    ? `${import.meta.env.VITE_BACKEND_URL}/api/auth`
    : "/api/auth";
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);
const DispatchContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case "reset_error": {
      return {
        ...state,
        error: null,
      };
    }
    case "added_error": {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }
    case "added_loading": {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case "cleared_loading": {
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    }
    case "logged_in": {
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.user,
      };
    }
    case "signed_in": {
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.user,
      };
    }
    case "checked_auth":
      return {
        ...state,
        user: action.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      };
    case "logged_out":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}

export function AuthProvider({ children }) {
  const [authStore, dispatch] = useReducer(authReducer, initialStore);
  const checkAuth = async () => {
    dispatch({
      type: "added_loading",
    });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      dispatch({
        type: "checked_auth",
        user: response.data.user,
      });
    } catch (error) {
      dispatch({
        type: "added_error",
      });
    }
  };

  const signup = async (email, password, name) => {
    dispatch({
      type: "added_loading",
    });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      dispatch({
        type: "signed_in",
        user: response.data.user,
      });
    } catch (error) {
      dispatch({
        type: "added_error",
        error: error.response?.data?.message || "Error signing up",
      });
    }
  };

  const verifyEmail = async (code) => {
    dispatch({
      type: "added_loading",
    });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      dispatch({
        type: "checked_auth",
        user: response.data.user,
      });
      // return response.data;
    } catch (error) {
      dispatch({
        type: "added_error",
        error: error.response?.data?.message || "Error verifying email",
      });
    }
  };

  const login = async (formData) => {
    dispatch({ type: "added_loading" });
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      dispatch({
        type: "logged_in",
        user: response.data.user,
      });
    } catch (error) {
      dispatch({
        type: "added_error",
        error: error.response?.data?.message || "Error logging up",
      });
    }
  };

  const logout = async () => {
    dispatch({ type: "added_loading" });
    try {
      await axios.post(`${API_URL}/logout`);
      dispatch({
        type: "logged_out",
      });
    } catch (error) {
      dispatch({
        type: "added_error",
        error: error.response?.data?.message || "Error logging out",
      });
    }
  };

  const forgotPassword = async (email) => {
    dispatch({ type: "added_loading" });
    try {
      await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      dispatch({
        type: "cleared_loading",
      });
    } catch (error) {
      dispatch({
        type: "added_error",
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
    }
  };

  const resetPassword = async (token, password) => {
    dispatch({ type: "added_loading" });
    try {
      await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      dispatch({
        type: "cleared_loading",
      });
    } catch (error) {
      dispatch({
        type: "added_error",
        error: error.response?.data?.message || "Error resetting password",
      });
    }
  };

  return (
    <AuthContext
      value={{
        ...authStore,
        checkAuth,
        login,
        logout,
        signup,
        verifyEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {/* authStore destrukturizuotas. Kiekvienas komponetas gali pasiimti bet kuria initial store reiksme, login ar kt. funkcija */}
      <DispatchContext value={dispatch}>{children}</DispatchContext>
    </AuthContext>
  );
}

export const useAuthStore = () => useContext(AuthContext);
export const useDispatch = () => useContext(DispatchContext);

const initialStore = {
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
};
