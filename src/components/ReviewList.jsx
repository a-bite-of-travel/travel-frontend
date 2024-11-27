import React, { useState } from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemText, Pagination, Button, Paper, Box, TextField } from '@mui/material';

// 예제 데이터
const sampleData = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    title: `게시판 제목 ${index + 1}`,
    author: `작성자 ${index + 1}`,
    date: `2023-11-${String(index + 1).padStart(2, '0')}`,
    content: `이것은 게시판 제목 ${index + 1}의 상세 내용입니다.`,
}));

export default function ReviewList() {
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰 데이터
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [newComment, setNewComment] = useState(""); // 새 댓글
    const itemsPerPage = 7; // 한 페이지에 표시할 항목 수

    // 현재 페이지에 해당하는 데이터 가져오기
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sampleData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value); // 페이지 변경
    };

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
                                        총 <strong>{sampleData.length}</strong> 건
                                    </Typography>
                                </div>

                                {/* 게시판 목록 */}
                                <div className='list_area'>
                                    <List>
                                        {currentItems.map((item) => (
                                            <ListItem
                                                key={item.id}
                                                button
                                                onClick={() => handleSelectReview(item)} // 상세 보기
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="h6">
                                                            {item.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body2" color="textSecondary">
                                                            작성자: {item.author} | 날짜: {item.date}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>

                                {/* 페이징 컴포넌트 */}
                                <Pagination
                                    count={Math.ceil(sampleData.length / itemsPerPage)} // 총 페이지 수 계산
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
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            댓글
                        </Typography>
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
                                등록
                            </Button>
                        </Box>
                    </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
}
