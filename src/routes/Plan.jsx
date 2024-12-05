import { FormControl, Grid, Box, Typography } from '@mui/material';
import { Form, useLoaderData, useActionData, useSubmit } from 'react-router-dom';
import TourPlanResultMap from '../components/TourPlanResultMap';
import TourPlanSelect from '../components/TourPlanSelect';
import axios from 'axios';
import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Plan() {
    const { tourCodeList } = useLoaderData(); // loader에서 받은 데이터
    const { cat, period, sigungu } = tourCodeList;
    const actionData = useActionData(); // action의 결과 데이터
    const submit = useSubmit(); // React Router의 form 데이터를 전송하는 함수

    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // 로딩 상태 시작
        const formData = new FormData(event.target);
        submit(formData, { method: 'post' }); // React Router로 데이터 전송
    };

    React.useEffect(() => {
        if (actionData) {
            setIsLoading(false); // 데이터 로드 완료 시 로딩 상태 종료
        }
    }, [actionData]);

    return (
        <Grid
            container
            id="container"
            className="bg-login"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh', padding: '20px' }}
        >
            <Grid item xs={12} md={10} lg={8}>
                {isLoading ? (
                    /* 로딩 화면 */
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <ClipLoader color="#36d7b7" size={50} />
                        <Typography sx={{ mt: 2 }}>데이터를 불러오는 중입니다...</Typography>
                    </Box>
                ) : actionData ? (
                    /* 결과 화면 */
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            width: '100%',
                            maxWidth: '1400px', // 결과 화면을 더 크게
                            minHeight: '800px', // 충분한 높이
                            margin: 'auto', // 화면 중앙 정렬
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <TourPlanResultMap data={actionData} />
                    </Box>
                ) : (
                    /* 입력 폼 */
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            width: '100%',
                            maxWidth: '700px', // 입력 화면 크기를 조금 더 넓게
                            minHeight: '500px',
                            margin: 'auto', // 화면 중앙 정렬
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <Form method="post" onSubmit={handleSubmit}>
                            <FormControl fullWidth>
                                <TourPlanSelect
                                    catCode={cat}
                                    periodCode={period}
                                    sigunguCode={sigungu}
                                />
                            </FormControl>
                        </Form>
                    </Box>
                )}
            </Grid>
        </Grid>
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

    const requestBody = {
        sigunguCode: JSON.parse(formData.get('sigunguCode')),
        startDate: formData.get('startDate'), // 선택한 시작 날짜
        period: formData.get('period'),
        theme: JSON.parse(formData.get('theme')),
    };

    try {
        const response = await axios.post('http://localhost:3500/tour', requestBody);
        return response.data.data;
    } catch (error) {
        console.error('Error:', error);
        return { error: '데이터 요청 실패' };
    }
}
