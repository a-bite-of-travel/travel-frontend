import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemText, Pagination, Button, Box, TextField } from '@mui/material';

export default function ReviewList() {
    const [reviews, setReviews] = useState([]); // 빈 배열로 초기화
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰 데이터
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [newComment, setNewComment] = useState(""); // 새 댓글
    const itemsPerPage = 7; // 한 페이지에 표시할 항목 수

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch("http://localhost:3500/review");
                const data = await response.json();

                console.log("API에서 반환된 데이터:", data);

                // 객체로 반환된 데이터에서 'data' 필드가 배열인지 확인하고 설정
                if (data && Array.isArray(data.data)) {
                    setReviews(data.data); // `data` 객체 내의 배열에 접근
                } else {
                    console.error("API에서 반환된 데이터가 예상 형식이 아닙니다:", data);
                    setReviews([]); // 예상과 다른 형식의 데이터일 경우 빈 배열로 초기화
                }
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
                setReviews([]); // 에러 발생 시 빈 배열로 초기화
            }
        };

        fetchReviews();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = Array.isArray(reviews) ? reviews.slice(startIndex, startIndex + itemsPerPage) : [];

    const handleSelectReview = (review) => {
        setSelectedReview(review); // 선택된 리뷰 저장
        setComments([]); // 선택 시 댓글 초기화
    };

    const handleBackToList = () => {
        setSelectedReview(null); // 선택된 리뷰 초기화
    };

    const handleAddComment = () => {
        if (newComment.trim() === "") {
            alert("댓글을 입력해주세요.");
            return;
        }

        const newComments = [
            ...comments,
            { id: comments.length + 1, text: newComment, date: new Date().toLocaleString() },
        ];
        setComments(newComments);
        setNewComment(""); // 입력 필드 초기화
    };

    const handleDeleteComment = (id) => {
        setComments(comments.filter((comment) => comment.id !== id));
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
                            <div>
                                Left 영역 콘텐츠
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
                                        {currentItems.map((review) => (
                                            <ListItem
                                                key={review._id || review.id}
                                                button
                                                onClick={() => handleSelectReview(review)} // 상세 보기
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="h6">
                                                            {review.title ? review.title : "제목 없음"}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body2" color="textSecondary">
                                                            작성자: {review.author ? review.author : "작성자 없음"} | 날짜: {review.date ? review.date : "날짜 없음"}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
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
                                <h4 className='tit_h4'>{selectedReview.title}</h4>
                                <div className='txt_author'>작성자 : <span className='mr30'>{selectedReview.author}</span> 날짜 : <span>{selectedReview.date}</span></div>
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
                                            key={comment.id}
                                            sx={{ borderBottom: "1px solid #e0e0e0" }}
                                        >
                                            <ListItemText
                                                primary={comment.text}
                                                secondary={`작성일: ${comment.date}`}
                                            />
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteComment(comment.id)}
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
