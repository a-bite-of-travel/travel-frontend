import {createBrowserRouter} from 'react-router-dom';
import RouterLayout from './RouterLayout';
import Main from './Main';
import Guide from '../components/Guide';
import Review from '../routes/Review'
import TourInfo, { loader as tourInfoLoader } from './TourInfo';
import Plan, { loader as tourPlanLoader, action as tourPlanAction } from './Plan';

const router = createBrowserRouter([
    {
        path: '',
        element: <RouterLayout />,
        children: [
            {path: '/', element: <Main />}, // 매인
            {path: '/:userId', element: <Main />}, // 마이페이지
            {path: '/plan', element: <Plan />, loader: tourPlanLoader, action: tourPlanAction}, // 여행 게획
            {path: '/tour', element: <TourInfo />, loader: (args) => tourInfoLoader({ ...args, type: "12" }),}, // 여행 정보
            {path: '/food', element: <TourInfo />, loader: (args) => tourInfoLoader({ ...args, type: "39" })},
            {path: '/festival', element: <Main />},
            {path: '/review', element: <Review />}, // 후기작성
            {path: '/guide', element: <Guide />}, // 임시메뉴 Guide
        ]
    },
]);

export default router;
