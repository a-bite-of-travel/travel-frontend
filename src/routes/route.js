import {createBrowserRouter} from 'react-router-dom';
import RouterLayout from './RouterLayout';
import Main from './Main';
import Plan, { loader as tourPlanLoader, action as tourPlanAction } from './Plan';
import Login from './Login';
import Signup from './Signup';
import Mypage from './Mypage';
import ReviewTour, { loader as reviewTourLoader } from './ReviewTour';
import TourInfoList, { loader as tourInfoLoader } from './TourInfoList';
import TourInfoDetail, { loader as tourInfoDetailLoader } from './TourInfoDetail';
import ReviewTourDetail, { loader as reviewTourDetailLoader, action as reviewTourDetailAction } from './ReviewTourDetail';
import Review from './Review';
import MyPlanDetail, { loader as myPlanDetailLoader } from './MyPlanDetail';

const router = createBrowserRouter([
    {
        path: '',
        element: <RouterLayout />,
        children: [
            {path: '/', element: <Main />}, // 매인
            {path: '/:userId', element: <Mypage />}, // 마이페이지
            {path: '/:userId/:planId', element: <MyPlanDetail />, loader: myPlanDetailLoader}, // 마이페이지
            {path: '/plan', element: <Plan />, loader: tourPlanLoader, action: tourPlanAction}, // 여행 게획
            {path: '/tour', element: <TourInfoList />, loader: (args) => tourInfoLoader({ ...args, type: "12" }),}, // 여행 정보
            {path: '/tour/:contentid', element: <TourInfoDetail />, loader: tourInfoDetailLoader },
            {path: '/food', element: <TourInfoList />, loader: (args) => tourInfoLoader({ ...args, type: "39" })},
            {path: '/review', element: <ReviewTour />, loader: reviewTourLoader}, // 후기작성
            {path: '/review/:reviewId', element: <ReviewTourDetail />, loader: reviewTourDetailLoader, action: reviewTourDetailAction}, // 여행 정보 // 여행지
            {path: '/review/create', element: <Review />}, // 여행 정보 // 여행지
            {path: '/auth/login', element: <Login />}, // 로그인
            {path: '/users/Signup', element: <Signup />}, // 회원가입
        ]
    },
]);

export default router;