import {createBrowserRouter} from 'react-router-dom';
import RouterLayout from './RouterLayout';
import Main from './Main';
import Guide from '../components/Guide';
import Login from './Login';
import Signup from './Signup';
import Mypage from './Mypage';
import Tourinfo from './tourinfo';
import Review from './Review';
import Review from '../routes/Review'
import TourInfo, { loader as tourInfoLoader } from './TourInfo';
import Location from './location';

const router = createBrowserRouter([
    {
        path: '',
        element: <RouterLayout />,
        children: [
            {path: '/', element: <Main />}, // 메인
            {path: '/:userId', element: <Mypage />}, // 마이페이지
            {path: '/tourinfo', element: <Tourinfo />}, // 여행 정보 // 여행지
            {path: '/plan', element: <Main />}, // 여행 게획
            {path: '/tour', element: <TourInfo />, loader: (args) => tourInfoLoader({ ...args, type: "관광지" }),}, // 여행 정보
            {path: '/food', element: <TourInfo />, loader: (args) => tourInfoLoader({ ...args, type: "음식점" })},
            {path: '/festival', element: <TourInfo />, loader: (args) => tourInfoLoader({ ...args, type: "축제" })},
            // {path: '/location', element: <Location />}, // 여행지
            // {path: '/dining', element: <Dining />}, // 음식점
            // {path: '/fiesta', element: <Fiesta />}, // 축제
            {path: '/review', element: <Review />}, // 후기작성
            {path: '/guide', element: <Guide />}, // 임시메뉴 Guide
            {path: '/auth/login', element: <Login />}, // 로그인
            {path: '/auth/Signup', element: <Signup />}, // 회원가입
        ]
    },
]);

export default router;
