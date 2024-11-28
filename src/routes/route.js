import {createBrowserRouter} from 'react-router-dom';
import RouterLayout from './RouterLayout';
import Main from './Main';
import Guide from '../components/Guide';
import Login from './Login';
import Signup from './Signup';

const router = createBrowserRouter([
    {
        path: '',
        element: <RouterLayout />,
        children: [
            {path: '/', element: <Main />}, // 매인
            {path: '/:userId', element: <Main />}, // 마이페이지
            {path: '/tour', element: <Main />}, // 여행 게획
            {path: '/tourinfo', element: <Main />}, // 여행 정보
            {path: '/review', element: <Main />}, // 리뷰
            {path: '/guide', element: <Guide />}, // 임시메뉴 Guide
            {path: '/auth/login', element: <Login />}, // 임시메뉴 Guide
            {path: '/auth/Signup', element: <Signup />}, // 임시메뉴 Guide
        ]
    },
]);

export default router;
