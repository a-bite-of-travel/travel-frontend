import { Button, Grid, Container, Divider, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, useLoaderData, useParams } from 'react-router-dom';

export default function MyPlanDetail() {
    const detail = useLoaderData();
    const navigate = useNavigate();
    const { userId } = useParams(); // URL에서 userid 추출

    const { days, title } = detail;

    const handleBackToList = () => {
        navigate(`/${userId}`);
    };

    return (
        <div className="contents_wrap">
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="ditail_area">
                            {/* 제목 */}
                            <h4 className='tit_h4'>{title}</h4>

                            <Grid spacing={3} justifyContent="center">
                                {days &&
                                    days.map((dayObj, index) => {
                                        const dayKey = Object.keys(dayObj)[0]; // 예: 'day1'
                                        const dayData = dayObj[dayKey]; // day1의 배열 데이터

                                        return (
                                            <div key={index}>
                                                {/* Day 제목 */}
                                                <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
                                                    {dayKey.toUpperCase()}
                                                </Typography>
                                                <Divider sx={{ marginBottom: 3 }} />

                                                {/* Day 데이터 렌더링 */}
                                                <Grid container spacing={3} className='tour_box_wrap'>
                                                    {Array.isArray(dayData) &&
                                                        dayData.map((item, idx) => (
                                                            <Grid item xs={12} key={idx}  className="tour_box">
                                                                <Card
                                                                    sx={{
                                                                        display: 'flex',
                                                                        borderRadius: 2,
                                                                        boxShadow: 'none',
                                                                        border: '1px solid #ddd',
                                                                        maxWidth: 800,
                                                                        margin: '0 auto',
                                                                        padding: 2,
                                                                    }}
                                                                      className="li"
                                                                >
                                                                    {item.firstimage2 ? (
                                                                        <CardMedia
                                                                            component="img"
                                                                            sx={{
                                                                                width: 120,
                                                                                height: 120,
                                                                                objectFit: 'cover',
                                                                                borderRadius: 1,
                                                                                marginRight: 2,
                                                                            }}
                                                                            image={item.firstimage2}
                                                                            alt={item.title}
                                                                            className='img_box'
                                                                        />
                                                                    ): (
                                                                        <CardMedia
                                                                            component="img"
                                                                            sx={{
                                                                                width: 120,
                                                                                height: 120,
                                                                                objectFit: 'cover',
                                                                                borderRadius: 1,
                                                                                marginRight: 2,
                                                                            }}
                                                                            image='/images/img_normal.png'
                                                                            className='img_box'
                                                                        />
                                                                    )}
                                                                    <CardContent
                                                                        sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            justifyContent: 'center',
                                                                            paddingLeft: 1,
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="h6"
                                                                            sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                                                                        >
                                                                            {item.title}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="textSecondary"
                                                                            sx={{ fontSize: '1rem', marginTop: 0.5 }}
                                                                        >
                                                                            {item.addr}
                                                                        </Typography>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        ))}
                                                </Grid>
                                            </div>
                                        );
                                    })}
                            </Grid>

                            {/* "목록으로" 버튼 */}
                            <Button variant="contained" color="primary" onClick={handleBackToList}>
                                목록으로
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export async function loader({ params }) {
    const { planId } = params;
    const res = await axiosInstance.get(`/tour/myplan/detail/${planId}`);
    return res.data.data;
}
