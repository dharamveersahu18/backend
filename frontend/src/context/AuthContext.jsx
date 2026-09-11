import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get("/users/current-user");
      if (res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
      }
    } catch (error) {
      // User is not logged in or token expired
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axiosInstance.post("/users/login", credentials);
      const { user: loggedInUser, accessToken } = res.data.data;
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      addToast(`Welcome back, ${loggedInUser.fullName}!`, "success");
      return { success: true, user: loggedInUser };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please check your credentials.";
      addToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await axiosInstance.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { user: registeredUser, accessToken } = res.data.data;
      setUser(registeredUser);
      localStorage.setItem("user", JSON.stringify(registeredUser));
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      addToast("Account created successfully!", "success");
      return { success: true, user: registeredUser };
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed.";
      addToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (error) {
      console.error("Logout request error", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      addToast("Logged out successfully", "info");
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        refreshCurrentUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
