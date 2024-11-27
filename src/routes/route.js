import {createBrowserRouter} from 'react-router-dom';
import RouterLayout from './RouterLayout';
import Main from './Main';
import Guide from '../components/Guide';
import Location from '../routes/location'
import Dining from '../routes/dining'
import Fiesta from '../routes/fiesta'
import Review from '../routes/Review'

const router = createBrowserRouter([
    {
        path: '',
        element: <RouterLayout />,
        children: [
            {path: '/', element: <Main />}, // 매인
            {path: '/:userId', element: <Main />}, // 마이페이지
            {path: '/tour', element: <Main />}, // 여행 게획
            {path: '/tourinfo', element: <Main />}, // 여행 정보
            {path: '/location', element: <Location />}, // 여행지
            {path: '/dining', element: <Dining />}, // 음식점
            {path: '/fiesta', element: <Fiesta />}, // 축제
            {path: '/review', element: <Review />}, // 후기작성
            {path: '/guide', element: <Guide />}, // 임시메뉴 Guide
            
        ]
    },
]);

export default router;
