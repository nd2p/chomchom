import React, { createContext, useEffect, useRef, useReducer } from 'react';
import { setupInterceptors } from '../../services/api/interceptors';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Keep a ref so the interceptor always reads the latest token
  // without needing to be re-registered on every token change.
  const tokenRef = useRef(state.token);
  useEffect(() => {
    tokenRef.current = state.token;
  }, [state.token]);

  // Register the interceptor ONCE on mount only.
  useEffect(() => {
    const cleanup = setupInterceptors({
      getToken: () => tokenRef.current,
    });
    return cleanup;
  }, []);

  const login = (user, token) => dispatch({ type: 'LOGIN', payload: { user, token } });

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
}
