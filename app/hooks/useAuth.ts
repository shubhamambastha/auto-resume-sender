"use client";

import { useState, useEffect } from "react";

interface User {
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const TOKEN_KEY = "auth_token";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  // Function to save token to localStorage
  const saveToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  };

  // Function to get token from localStorage
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  };

  // Function to remove token from localStorage
  const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  // Function to verify token with the server
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.valid && result.user) {
          setAuthState({
            isAuthenticated: true,
            user: result.user,
            token: token,
            isLoading: false,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  // Function to login
  const login = async (token: string, user: User) => {
    saveToken(token);
    setAuthState({
      isAuthenticated: true,
      user,
      token,
      isLoading: false,
    });
  };

  // Function to logout
  const logout = () => {
    removeToken();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  };

  // Check for existing token on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (token) {
        const isValid = await verifyToken(token);
        if (!isValid) {
          // Token is invalid, remove it
          removeToken();
          setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
          });
        }
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  return {
    ...authState,
    login,
    logout,
    verifyToken,
  };
}
