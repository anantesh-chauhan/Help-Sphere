import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // You missed this in the code snippet

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  // ✅ Load user on app mount
  useEffect(() => {
    loadUser();
  }, []);

  const handleLogin = (user) => {
    console.log("User logged in from app context", user);
    setUserData(user);
    setIsAdmin(user?.role === "admin");
  };

  const setLogout = () => {
    console.log("User logged out from app context");
    setUserData(null);
    setIsAdmin(false);
  };

  const loadUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/profile`, {
        withCredentials: true,
      });
      console.log(`User data loaded:`, res.data)
      if (res.data?.user) {
        setUserId(res.data.user._id);
        setUserData(res.data.user);
        setIsAdmin(res.data.user.role === "admin");
      }
    } catch (err) {
      setUserData(null);
      setIsAdmin(false);
    }
  };

  const value = {
    backendUrl,
    isAdmin,
    userData,
    userId,
    setIsAdmin,
    setUserData,
    handleLogin,
    setLogout,
    loadUser,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
