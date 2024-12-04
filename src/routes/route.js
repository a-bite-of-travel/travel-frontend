import {createBrowserRouter} from 'react-router-dom';
import RouterLayout from './RouterLayout';
import Main from './Main';
import Guide from '../components/Guide';
import Plan, { loader as tourPlanLoader, action as tourPlanAction } from './Plan';
import Login from './Login';
import Signup from './Signup';
import Mypage from './Mypage';
import ReviewTour from './ReviewTour';
import Review from './Review';
import TourInfoList, { loader as tourInfoLoader } from './TourInfoList';
import TourInfoDetail, { loader as tourInfoDetailLoader } from './TourInfoDetail';

const router = createBrowserRouter([
    {
        path: '',
        element: <RouterLayout />,
        children: [
            {path: '/', element: <Main />}, // 매인
            {path: '/:userId', element: <Mypage />}, // 마이페이지
            {path: '/tourinfo', element: <ReviewTour />}, // 여행 정보 // 여행지
            {path: '/plan', element: <Plan />, loader: tourPlanLoader, action: tourPlanAction}, // 여행 게획
            {path: '/tour', element: <TourInfoList />, loader: (args) => tourInfoLoader({ ...args, type: "12" }),}, // 여행 정보
            {path: '/tour/:contentid', element: <TourInfoDetail />, loader: tourInfoDetailLoader },
            {path: '/food', element: <TourInfoList />, loader: (args) => tourInfoLoader({ ...args, type: "39" })},
            {path: '/festival', element: <Main />},
            {path: '/review', element: <Review />}, // 후기작성
            {path: '/guide', element: <Guide />}, // 임시메뉴 Guide
            {path: '/auth/login', element: <Login />}, // 로그인
            {path: '/auth/Signup', element: <Signup />}, // 회원가입
        ]
    },
]);

export default router;
