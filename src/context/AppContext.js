import React, { createContext, useState, useContext } from "react";

// Context 생성
const AppContext = createContext();

// Context Provider
export const AppProvider = ({ children }) => {
    const [refreshHeader, setRefreshHeader] = useState(false); // 상태 관리

    // 상태 토글 함수
    const triggerRefresh = () => {
        console.log('triggerRefresh'); 
        setRefreshHeader((prev) => {
            console.log(prev, !prev)
            return !prev;
        });
    };

    return (
        <AppContext.Provider value={{ refreshHeader, triggerRefresh }}>
            {children}
        </AppContext.Provider>
    );
};

// Context 사용
export const useAppContext = () => useContext(AppContext);
