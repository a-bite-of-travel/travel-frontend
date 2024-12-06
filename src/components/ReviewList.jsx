import React, { useState } from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemText, Pagination, Button, Box, TextField } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ReviewList({reviews}) {
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const itemsPerPage = 4; // 한 페이지에 표시할 항목 수
    const navigate = useNavigate();

    // 날짜만 포맷팅 함수
    const formatDateOnly = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = Array.isArray(reviews) ? reviews.slice(startIndex, startIndex + itemsPerPage) : [];

    const handleItemClick = (reviewId) => {
        navigate(`/tourinfo/${reviewId}`);
    };

    return (
        <Container maxWidth="lg">
            {/* 게시판 목록 */}
            <Grid container spacing={2}>
                {/* 왼쪽 영역 */}
                <Grid item xs={4}>
                    <h3 className='tit_h3 mt40'>추천 리뷰</h3>
                    <div className='left_review'>
                        {reviews.length > 0 && (
                            <ListItem
                                key={reviews[0]?._id}
                                button
                                onClick={() => handleItemClick(reviews[0]?._id)}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6">
                                            {reviews[0]?.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="textSecondary">
                                            {reviews[0]?.content}
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
                                {reviews.length === 0 ? (
                                    <Typography variant="body1">리뷰가 존재하지 않습니다</Typography>
                                ) : (
                                    currentItems.map((review) => (
                                        <ListItem
                                            key={review._id || review.id}
                                            button
                                            onClick={() => handleItemClick(review._id)} // 상세 보기
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6">
                                                        {review.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="textSecondary">
                                                        <b>작성자 : </b> {review.userName} <span> | </span> <b>작성일 : </b> {formatDateOnly(review.createdAt)}
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
        </Container>
    );
}
