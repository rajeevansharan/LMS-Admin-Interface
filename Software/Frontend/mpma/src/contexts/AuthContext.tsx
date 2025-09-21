"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// * Interface defining the structure of authenticated user data
interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

// * Interface defining the authentication context API
// * Provides types for authentication-related functionality
interface AuthContextType {
  user: User | null; // Current authenticated user or null if not logged in
  token: string | null; // JWT token for API requests or null if not logged in
  login: (username: string, password: string) => Promise<void>; // Authentication method
  logout: () => void; // Method to clear authentication state
  isAuthenticated: boolean; // Convenience flag for auth status
}

// ! Core authentication context that provides auth state across the application
// ! This must wrap any components that need authentication functionality
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ! Primary authentication provider component
// ! Handles authentication state management and storage
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // ? State variables for authentication data
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // * Check for existing auth data on component mount
  // * Restores user session from localStorage if available
  useEffect(() => {
    // Check if user is logged in on page load
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // * Handles user authentication against the backend API
  // * Stores authentication data in state and localStorage
  const login = async (username: string, password: string): Promise<void> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error types
        if (response.status === 429 && data.code === "RATE_LIMITED") {
          throw {
            isRateLimited: true,
            message: data.message || "Account temporarily locked",
            details: data.details || "Please try again later",
            retryAfterMinutes: data.retryAfterMinutes || 15,
            code: data.code,
          };
        }

        // Handle other error types
        throw new Error(data.error || data.message || "Login failed");
      }

      // Store token and user data
      setToken(data.token);
      setUser({
        id: data.id,
        username: data.username,
        name: data.name,
        role: data.role,
      });

      // Store in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          username: data.username,
          name: data.name,
          role: data.role,
        }),
      );

      // Also store in cookies for middleware access
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      document.cookie = `user=${JSON.stringify({
        id: data.id,
        username: data.username,
        name: data.name,
        role: data.role,
      })}; path=/; max-age=86400`;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // * Clears authentication data from state and storage
  const logout = async () => {
    try {
      // Call the backend logout endpoint to invalidate the token
      if (token) {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });
      }
    } catch (error) {
      console.error("Error during server-side logout:", error);
      // Continue with client-side logout even if server-side logout fails
    } finally {
      // Client-side cleanup
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Also clear cookies
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "user=; path=/; max-age=0";
    }
  };

  // TODO: Add token refresh mechanism to handle expired tokens
  // TODO: Add role-based access control helper functions

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// * Custom hook to access auth context from any component
// * Provides type-safe authentication functionality
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
