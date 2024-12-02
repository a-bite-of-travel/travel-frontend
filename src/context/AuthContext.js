import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // 로그인 함수
  const loginedCheck = async (user) => {
    try {
      // const resp = await axiosInstance.post("/auth/login", { email, password });
      // const { user, accessToken, refreshToken } = resp.data;

      setUser(user);
      // console.log('login','user', resp.data);
      setIsLoggedIn(true);

      // localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);
      
    } catch (error) {
      console.error("Login error:", error);
      setIsLoggedIn(false); // 실패 시 로그아웃 상태 유지
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false); 
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // 세션 복원 함수
  const restoreSession = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      setIsLoggedIn(false); // 토큰이 없으면 로그아웃 상태로 설정
      return;
    }

    try {
      const resp = await axiosInstance.post("/auth/validate", {
        token: accessToken,
      });
      if (resp.data.valid) {
        setUser({
          ...resp.data.user,
          accessToken,
          refreshToken,
        });
        setIsLoggedIn(true); // 유효한 세션일 경우 로그인 상태
      }
    } catch (error) {
      // 토큰이 유효하지 않으면 리프레시 시도
      try {
        const resp = await axiosInstance.post("/auth/refresh", {
          refreshToken,
        });
        const { accessToken: newAccessToken } = resp.data;

        setUser({
          ...resp.data.user,
          accessToken: newAccessToken,
          refreshToken,
        });
        localStorage.setItem("accessToken", newAccessToken);
        setIsLoggedIn(true); // 새 토큰 발급 시 로그인 상태
      } catch (refreshError) {
        console.error("Session restore failed:", refreshError);
        logout(); // 실패 시 로그아웃 처리
      }
    }
  };

  // 페이지 로드 시 세션 복원
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loginedCheck, logout, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
