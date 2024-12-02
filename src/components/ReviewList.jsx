import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemText, Pagination, Button, Box, TextField } from '@mui/material';
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from 'jwt-decode';

export default function ReviewList() {
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]); // 리뷰 목록
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰 데이터
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [userNickname, setUserNickname] = useState(""); // 로그인한 사용자의 닉네임
    const [newComment, setNewComment] = useState(""); // 새 댓글
    const itemsPerPage = 7; // 한 페이지에 표시할 항목 수
    
    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24시간 형식
        });
    };

    // 날짜만 포맷팅 함수
    const formatDateOnly = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // 토큰에서 사용자 닉네임 가져오기
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // jwtDecode 사용
                const userId = decodedToken.id;

                // 서버에서 사용자 정보 가져오기
                axiosInstance.get(`/user/${userId}`)
                    .then(response => {
                        if (response.status === 200) {
                            setUserNickname(response.data.nickname); // 닉네임 설정
                        }
                    })
                    .catch(error => {
                        console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
                    });
            } catch (error) {
                console.error("토큰 디코딩에 실패했습니다:", error);
            }
        }
    }, []);
    
    // 리뷰 목록 가져오기
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get("/review");
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
            }
            setLoading(false);
        };

        fetchReviews();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = Array.isArray(reviews) ? reviews.slice(startIndex, startIndex + itemsPerPage) : [];

    // 리뷰 선택 시 댓글 가져오기
    const handleSelectReview = async (selectedReview) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/review/${selectedReview._id}`);
            if (response.status === 200) {
                console.log("리뷰 상세 데이터:", response.data);
                setSelectedReview(response.data.data); // 서버에서 가져온 리뷰 데이터 설정
                setComments(response.data.data.comments || []); // 댓글 데이터 설정
            } else {
                console.error(`리뷰 조회 실패: 상태 코드 ${response.status}`);
                alert(`리뷰 조회에 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error("리뷰 조회 실패:", error);
            alert("서버와의 연결에 실패했습니다.");
        }
        setLoading(false);
    };
    
    const handleBackToList = () => {
        setSelectedReview(null); // 선택된 리뷰 초기화
    };

    // 댓글 추가
    const handleAddComment = async () => {
        if (!selectedReview) {
            alert("리뷰를 선택해주세요.");
            return;
        }

        if (newComment.trim() === "") {
            alert("댓글을 입력해주세요.");
            return;
        }

        const newCommentData = { content: newComment, author: userNickname };

        try {
            const response = await axiosInstance.put(`/review/${selectedReview._id}/comments`, newCommentData);
            if (response.status === 200) {
                // 댓글이 성공적으로 추가된 후 서버에서 최신 댓글 목록 가져오기
                await handleSelectReview(selectedReview);
                setNewComment(""); // 입력 필드 초기화
            } else {
                alert(`댓글 추가에 실패했습니다: ${response.data.error || "알 수 없는 오류"}`);
            }
        } catch (error) {
            console.error("댓글 추가 실패:", error);
            alert("서버와의 연결에 실패했습니다.");
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await axiosInstance.delete(`/review/comments/${commentId}`);
            if (response.status === 200) {
                setComments(comments.filter((comment) => comment._id !== commentId));
            } else {
                alert(`댓글 삭제에 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
            alert("서버와의 연결에 실패했습니다.");
        }
    };

    return (
        <Container maxWidth="lg">
            {!selectedReview ? (
                <>
                    {/* 게시판 목록 */}
                    <Grid container spacing={2}>
                        {/* 왼쪽 영역 */}
                        <Grid item xs={4}>
                            <h3 className='tit_h3 mt40'>추천 리뷰</h3>
                            <div className='left_review'>
                                {reviews.length > 0 && (
                                    <ListItem
                                        key={reviews[0]._id}
                                        button
                                        onClick={() => handleSelectReview(reviews[0])}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6">
                                                    {reviews[0].title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="textSecondary">
                                                    {reviews[0].content}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}
                            </div>
                        </Grid>

                        {/* 오른쪽 영역 */}
                        <Grid item xs={8}>
                            <div className='list_wrap'>
                                {/* 총 건수 표시 */}
                                <div className='txt_total'>
                                    <Typography variant="body1">
                                        총 <strong>{reviews.length}</strong> 건
                                    </Typography>
                                </div>

                                {/* 게시판 목록 */}
                                <div className='list_area'>
                                    <List>
                                    {loading ? (
                                            <Typography variant="body1">로딩 중...</Typography>
                                        ) : (
                                        currentItems.map((review) => (
                                            <ListItem
                                                key={review._id || review.id}
                                                button
                                                onClick={() => handleSelectReview(review)} // 상세 보기
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="h6">
                                                            {review.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body2" color="textSecondary">
                                                            작성자: ${review.author || userNickname} | 날짜: {formatDateOnly(review.createdAt)}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                    </List>
                                </div>

                                {/* 페이징 컴포넌트 */}
                                <Pagination
                                    count={Math.ceil(reviews.length / itemsPerPage)} // 총 페이지 수 계산
                                    page={currentPage}
                                    onChange={handlePageChange}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <>
                    {/* 상세 페이지 */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className='ditail_area'>
                                <h4 className='tit_h4'>{selectedReview?.title || "제목 없음"}</h4>
                                <div className='txt_author'>작성자 : <span className='mr30'>{selectedReview.author || userNickname}</span> 
                                                            날짜 : <span>{formatDateOnly(selectedReview.createdAt)}</span></div>
                                <div className='txt_content'>{selectedReview.content}</div>
                                <Button variant="contained" color="primary" onClick={handleBackToList}>
                                    목록으로
                                </Button>
                            </div>
                            {/* 댓글 영역 */}
                            <div className='comment_area'>
                                <div className='comment_box'>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            placeholder="댓글을 입력하세요"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddComment}
                                        >
                                            댓글<br/>달기
                                        </Button>
                                    </Box>
                                </div>
                            
                                <List sx={{ mb: 2 }}>
                                    {comments.map((comment) => (
                                        <ListItem
                                            key={comment._id} // 고유한 key 추가
                                            sx={{ borderBottom: "1px solid #e0e0e0" }}
                                        >
                                            <ListItemText
                                                primary={comment.content}
                                                secondary={`작성일: ${formatDate(comment.createdAt)}`}
                                            />
                                            
                                            <p>작성자 : {comment.nickName}</p>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteComment(comment._id)}
                                            >
                                                삭제
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
}
