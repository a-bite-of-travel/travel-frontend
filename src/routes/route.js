import {createBrowserRouter} from 'react-router-dom';
import RouterLayout from './RouterLayout';
import Main from './Main';
import Guide from '../components/Guide';
import Tourinfo from './tourinfo';
import Dining from './Dining';
import Fiesta from './Fiesta';
import Review from './Review';

const router = createBrowserRouter([
    {
        path: '',
        element: <RouterLayout />,
        children: [
            {path: '/', element: <Main />}, // 매인
            {path: '/:userId', element: <Main />}, // 마이페이지
            {path: '/tour', element: <Main />}, // 여행 게획
            {path: '/tourinfo', element: <Tourinfo />}, // 여행 정보 // 여행지
            {path: '/dining', element: <Dining />}, // 음식점
            {path: '/fiesta', element: <Fiesta />}, // 축제
            {path: '/review', element: <Review />}, // 후기작성
            {path: '/guide', element: <Guide />}, // 임시메뉴 Guide
            
        ]
    },
]);

export default router;
