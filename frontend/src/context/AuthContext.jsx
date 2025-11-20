import { createContext, useContext, useReducer } from "react";

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

  return (
    <AuthContext value={authStore}>
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
