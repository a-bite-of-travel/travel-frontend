import React, { useEffect, useState } from "react";
import {
    Container,
    Grid,
    Avatar,
    Typography,
    List,
    ListItem,
    CircularProgress,
    Tabs,
    Tab,
    Box, ListItemText,
} from '@mui/material';

import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import SubTitle from "../components/SubTitle";
import MyPlan from '../components/Myplan';
import {Link as RouterLink, useNavigate} from 'react-router-dom';

export default function Mypage() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0); // 현재 활성화된 탭 상태
    const navigate = useNavigate();

    const profileImage = user?.profileImage ? user.profileImage.replace(/^public[\\/]/, "/").replace(/\\/g, "/") : null;

    useEffect(() => {
        if (activeTab === 0) {
            // 활성화된 탭이 리뷰 탭일 때만 리뷰 데이터를 가져옴
            const fetchReviews = async () => {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(`/review/user/${user.id}`);
                    if (response.status === 200) {
                        console.log("API에서 반환된 데이터:", response.data);
                        setReviews(response.data.data); // 서버에서 가져온 리뷰 데이터 설정
                    } else {
                        console.error("API에서 반환된 데이터가 예상 형식이 아닙니다:", response);
                        setReviews([]); // 예상과 다른 형식의 데이터일 경우 빈 배열로 초기화
                    }
                } catch (error) {
                    console.error("데이터 가져오기 실패:", error);
                    setReviews([]); // 에러 발생 시 빈 배열로 초기화
                }
                setLoading(false);
            };

            fetchReviews();
        }
    }, [activeTab]); // activeTab 변경 시 실행

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const formatDateOnly = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="contents_wrap">
            <SubTitle type="ty5" />
            <Container maxWidth={false} id="container" className="mypage" sx={{ backgroundColor: '#f0f0f0' }}>
                <Container maxWidth="lg">
                    <Grid container alignItems="center" spacing={4} className="top">
                        <Grid item>
                            <Avatar
                                src={profileImage ? `${process.env.REACT_APP_BASE_URL}${profileImage}` : "/images/profile_default.png"}
                                alt={user?.nickName}
                                sx={{ width: 100, height: 100 }}
                            />
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body1">
                                <b>Nickname : </b> {user?.nickName}
                            </Typography>
                            <Typography variant="body1">
                                <b>E-Mail : </b> {user?.email}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Container>

            <Container maxWidth="lg">
                <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: 4 }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="mypage tabs">
                        <Tab label="내가 작성한 리뷰 목록" />
                        <Tab label="나의 여행 일정 목록" />
                    </Tabs>
                </Box>
                <div className="tab-content">
                    {activeTab === 0 && (
                        <div className='list_area ty2'>
                            {loading ? (
                                <CircularProgress sx={{ margin: '20px auto' }} />
                            ) : Array.isArray(reviews) && reviews.length > 0 ? (
                                <List>
                                    {reviews.map((review) => (
                                        <ListItem
                                            key={review._id || review.id}
                                            button
                                            component={RouterLink} to={`/review/${reviews[0]?._id}`}
                                            state={{ from: `/${user.id}` }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6">
                                                        {review.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="textSecondary">
                                                        <b>작성자 :</b> {review.userName} <span> | </span> <b>작성일 :</b> {formatDateOnly(review.createdAt)}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" sx={{ marginTop: 2, pt: 2, pb: 3, textAlign: 'center' }}>
                                    작성한 리뷰가 없습니다.
                                </Typography>
                            )}
                        </div>
                    )}
                    {activeTab === 1 && (
                        <MyPlan />
                    )}
                </div>
            </Container>
        </div>
    );
}
