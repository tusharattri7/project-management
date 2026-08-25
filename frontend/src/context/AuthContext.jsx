import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUserApi,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
} from "../api/auth.api.js";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await getCurrentUserApi();
        setUser(response.data?.data || null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUserApi(credentials);
      const loggedInUser = response.data?.data?.user;
      setUser(loggedInUser);
      toast.success("Logged in successfully!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUserApi(userData);
      toast.success(response.data?.message || "Registration successful!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUserApi();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      setUser(null);
      toast.error("Logged out");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
