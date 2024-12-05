import React, { useEffect, useState } from "react"; 
import {
    Container,
    Grid,
    Avatar,
    Typography,
    List, 
    ListItem,
    CircularProgress
} from '@mui/material';

import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import SubTitle from "../components/SubTitle";

export default function Mypage() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    console.log('user >>>>>>>>>>>>>>>> ', user);
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/review/user/${user.id}`);
                if (response.status === 200) {
                    console.log("API에서 반환된 데이터:", response.data);
                    setReviews(response.data.data.review); // 서버에서 가져온 리뷰 데이터 설정
                } else {
                    console.error("API에서 반환된 데이터가 예상 형식이 아닙니다:", response);
                    setReviews([]); // 예상과 다른 형식의 데이터일 경우 빈 배열로 초기화
                }
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
                setReviews([]); // 에러 발생 시 빈 배열로 초기화
                
                //console.log('reivews >>>>>>>>>>>>>>>>>>. ', reviews);
            }
            setLoading(false);
        };

        fetchReviews();
    }, []);

    return (
        <div className="contents_wrap">
            <SubTitle type="ty5" />
            <Container maxWidth={false} id="container" className="mypage" sx={{ backgroundColor: '#f0f0f0' }}>
                <Container maxWidth="lg">
                    <Grid container alignItems="center" spacing={4} className="top">
                        <Grid item>
                            <Avatar
                                src={user?.profileImage ? `http://localhost:3500${user.profileImage}` : "/images/profile_default.png"}
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
                <h3 className="mt40">내가 작성한 리뷰목록</h3>
                <div className='list_area ty2'>
                    {loading ? (
                        <CircularProgress sx={{ margin: '20px auto' }} />
                    ) : reviews.length > 0 ? (
                        <List>
                            {reviews.map((review) => (
                                <ListItem key={review.id} className="review-item">
                                    <Typography variant="h6">
                                        {review.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {review.content}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                            작성한 리뷰가 없습니다.
                        </Typography>
                    )}
                </div>
            </Container>
        </div>
    );
}