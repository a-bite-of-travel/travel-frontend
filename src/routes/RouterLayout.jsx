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