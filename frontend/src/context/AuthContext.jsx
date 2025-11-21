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
    case "logged_in": {
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
        isCheckingAuth: action.isCheckingAuth,
        isAuthenticated: action.isAuthenticated,
        error: null,
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}

export function AuthProvider({ children }) {
  const [authStore, dispatch] = useReducer(authReducer, initialStore);

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

  return (
    <AuthContext value={{ ...authStore, login }}>
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
  isCheckingAuth: true,
};
