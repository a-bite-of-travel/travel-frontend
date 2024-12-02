import Header from '../components/Header';
import Footer from '../components/Footer';
import {Outlet} from 'react-router-dom';

function RouterLayout() {
    return <>
        <Header />
        <Outlet />
        <Footer />
    </>
}

export default RouterLayout;

// import React from "react";
// import { useAppContext } from "../context/AppContext"; // Context 사용

// export default function RouterLayout() {
//     const { refreshHeader } = useAppContext(); // 상태를 구독

//     return (
//         <>
//             <Header /> {/* 상태 변경 시 재렌더링 */}
//             <Outlet />
//             <Footer />
//         </>
//     );
// }