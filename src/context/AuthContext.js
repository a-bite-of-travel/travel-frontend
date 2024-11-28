import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 로그인 함수
  const login = async ({ email, password }) => {
    try {
      const resp = await axiosInstance.post("/auth/login", { email, password });
      const { user, accessToken, refreshToken } = resp.data;
      
      setUser({ user, accessToken, refreshToken });
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // 세션 복원 함수
  const restoreSession = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) return;

    try {
      const resp = await axiosInstance.post("/auth/validate", {
        token: accessToken,
      });
      if (resp.data.valid) {
        setUser({
          user: resp.data.user,
          accessToken,
          refreshToken,
        });
      }
    } catch (error) {
      // 토큰이 유효하지 않으면 리프레시 시도
      try {
        const resp = await axiosInstance.post("/auth/refresh", {
          refreshToken,
        });
        const { accessToken: newAccessToken } = resp.data;
        setUser({
          user: resp.data.user,
          accessToken: newAccessToken,
          refreshToken,
        });
        localStorage.setItem("accessToken", newAccessToken);
      } catch (refreshError) {
        console.error("Session restore failed:", refreshError);
        logout();
      }
    }
  };

  // 페이지 로드 시 세션 복원
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
