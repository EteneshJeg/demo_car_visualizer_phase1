import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    id: null,
    name: null,
    username: null,
    access: null,
    refresh: null,
    is_staff: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    initStore();
  }, []);

  const initStore = async () => {
    if (localStorage.getItem("user.access")) {
      setUser((prev) => ({
        ...prev,
        access: localStorage.getItem("user.access"),
        refresh: localStorage.getItem("user.refresh"),
        id: localStorage.getItem("user.id"),
        name: localStorage.getItem("user.name"),
        username: localStorage.getItem("user.username"),
        isAuthenticated: true,
      }));

      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("user.access")}`;
      await refreshToken();
      await refreshStaffStatus();
    }
    setHasLoaded(true);
  };

  const setToken = (data) => {
    setUser((prev) => ({
      ...prev,
      access: data.access,
      refresh: data.refresh,
      isAuthenticated: true,
    }));
    console.log("data", data)
    if(data.access != null) {
      localStorage.setItem("user.access", data.access);
    }
    if(data.refresh != null) {
      localStorage.setItem("user.refresh", data.refresh);
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
  };

  const removeToken = () => {
    setUser({
      isAuthenticated: false,
      id: null,
      name: null,
      username: null,
      access: null,
      refresh: null,
      is_staff: false,
    });
    localStorage.clear();
    axios.defaults.headers.common["Authorization"] = "";
  };

  const setUserInfo = (userData) => {
    setUser((prev) => ({
      ...prev,
      id: userData.id,
      name: userData.name,
      username: userData.username,
      is_staff: userData.is_staff,
    }));
    localStorage.setItem("user.id", userData.id);
    localStorage.setItem("user.name", userData.name);
    localStorage.setItem("user.username", userData.username);
  };

  const refreshStaffStatus = async () => {
    try {
      const response = await axios.get(`/api/account/users/me/`);
      setUserInfo(response.data);
    } catch (error) {
      console.error("Failed to refresh staff status:", error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post("/api/account/refresh/", {
        refresh: localStorage.getItem("user.refresh"),
      });
      if (response.data) {
        setToken(response.data);
      } else {
        removeToken();
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      removeToken();
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, hasLoaded, setToken, removeToken, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
