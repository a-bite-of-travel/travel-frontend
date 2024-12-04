import { FormControl, Grid, Box} from '@mui/material';
import { useLoaderData, useActionData } from 'react-router-dom';
import TourPlanResultMap from '../components/TourPlanResultMap';
import TourPlanSelect from '../components/TourPlanSelect';
import axios from 'axios';
import Course from './Course';

export default function Plan() {
    const { tourCodeList } = useLoaderData(); // loader에서 받은 데이터
    const { cat, period, sigungu } = tourCodeList;
    const actionData = useActionData(); // action의 결과 데이터

    return (
        <>
            <Grid container id="container" className="bg-login" alignItems="center" justifyContent="center">
                <Grid item>
                    <Box sx={{
                        backgroundColor: 'white',
                        width: 600,
                        maxWidth: '100%',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                    }} component="form">
                        <FormControl fullWidth>
                            {/*<Course />*/}
                            <TourPlanSelect
                                catCode={cat}
                                periodCode={period}
                                sigunguCode={sigungu}
                            />
                            {actionData && <TourPlanResultMap data={actionData} />}
                        </FormControl>
                    </Box>
                </Grid>
        </Grid >
        </>
    );
}

export async function loader() {
    const tourCodeList = await axios.get(`http://localhost:3500/tour/code`);

    return {
        tourCodeList: tourCodeList.data.data,
    };
}

export async function action({ request }) {
    const formData = await request.formData();

    let theme = [JSON.parse(formData.get('theme'))];
    theme = theme.map(({ type, ...rest }) => rest);

    const requestBody = {
        sigunguCode: JSON.parse(formData.get('sigunguCode')), // 지역 정보
        startDate: '2024-11-20', // 임시 날짜 값 (필요시 추가 UI로 수정 가능)
        period: formData.get('period'), // 여행 기간
        theme: theme, // 선택된 테마
    };

    try {
        const response = await axios.post('http://localhost:3500/tour', requestBody);

        return response.data.data; // 서버 응답 반환
    } catch (error) {
        console.error('Error:', error);
        return { error: '데이터 요청 실패' };
    }
}