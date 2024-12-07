import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    Stack,
    Box,
    CircularProgress
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from "../context/AuthContext";

export default function MyPlan() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            if (!user || !user.id) {
                console.error("User is not authenticated or user ID is missing");
                setLoading(false);
                return;
            }
            const userId = user.id;

            setLoading(true);
            try {
                const response = await axiosInstance.get(`/tour/myplan/${userId}`);
                if (response.status === 200) {
                    console.log("받은 데이터:", response.data);
                    setPlans(response.data.data); // API에서 반환된 데이터를 상태에 저장
                } else {
                    console.error("API 응답 오류:", response);
                    setPlans([]); // 데이터 형식이 예상과 다를 경우 빈 배열로 초기화
                }
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
                setPlans([]); // 에러 발생 시 빈 배열로 초기화
            }
            setLoading(false);
        };

        fetchPlans();
    }, [user]);

    const formatDateOnly = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleItemClick = (planId) => {
        navigate(`/${user.id}/${planId}/`);
    };

    const themeMapping = {
        "자연즐기기": "thema1",
        "역사탐방": "thema2",
        "신나게놀기": "thema3",
        "체험활동": "thema4",
        "문화와건축": "thema5",
        "한식": "thema6",
        "양식": "thema7",
        "일식": "thema8",
        "중식": "thema9",
        "이색음식점": "thema10",
        "카페": "thema11",
    };

    return (
        <Container maxWidth="lg" id="container" className="myPlan">
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
            ) : plans.length > 0 ? (
                <List className="tour_box">
                    {plans.map((plan) => (
                        <ListItem key={plan.id} sx={{ mb: 2, border: '1px solid #f0f0f0' }} onClick={() => handleItemClick(plan._id)}>
                            <Box
                                component="img"
                                src={plan.firstimage2 || '/images/nullimg.png'} // 기본 이미지 처리
                                alt={plan.title || '여행 제목'}
                                className="img_box"
                            />
                            <div>
                                <ListItemText
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{
                                                whiteSpace: 'normal',      // 줄바꿈 허용
                                                wordBreak: 'break-word',   // 단어가 부모 요소를 넘지 않도록 줄바꿈
                                                display: 'block',          // 블록 요소로 설정
                                                maxWidth: '110ch'           // 약 70자의 너비에 맞게 제한
                                            }}
                                        >
                                            {plan.summary}
                                        </Typography>
                                    }
                                />

                                <ListItemText
                                    secondary={
                                        <Typography variant="body2" color="textSecondary" noWrap>
                                            여행 시작일: {formatDateOnly(plan.startDate)} / 여행 기간: {plan.period }
                                        </Typography>
                                    }
                                />
                                <Stack direction="row" spacing={1} sx={{ mt: 2 }} className="chips">
                                    {plan.theme &&
                                        plan.theme.split(',').map((theme, index) => {
                                            const chipColor = themeMapping[theme.trim()] || "default"; // 매핑된 색상 또는 기본값
                                            return <Chip key={index} label={theme.trim()} color={chipColor} />;
                                        })}
                                </Stack>
                            </div>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" sx={{ mt: 2, pt: 2, pb: 3, textAlign: 'center' }}>
                    여행 계획이 없습니다.
                </Typography>
            )}
        </Container>
    );
}
