import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, List, ListItem, ListItemText, Pagination, Button, Box, TextField } from '@mui/material';
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';

export default function ReviewList() {
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]); // 리뷰 목록
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰 데이터
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [newComment, setNewComment] = useState(""); // 새 댓글
    const itemsPerPage = 4; // 한 페이지에 표시할 항목 수
    const { user } = useAuth(); // useAuth 훅을 사용하여 로그인된 사용자 정보

    const sanitizedContent = DOMPurify.sanitize(selectedReview?.content || "", {
        ALLOWED_TAGS: [
            'img', 'strong', 'ul', 'li', 'ol', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'em', 'a'
        ],
        ALLOWED_ATTR: [
            'src', 'alt', 'title', 'width', 'height', 'class', 'style', 'href', 'target'
        ]
    })

   // 현재 로그인된 사용자가 리뷰 작성자인지 확인
    const isAuthor = user && selectedReview && user._id === selectedReview.userId?.toString();

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

        const newCommentData = { content: newComment };

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
            if (response.status === 200 || response.status === 204) {
                // 상태 업데이트
                setComments(comments.filter((comment) => comment._id !== commentId));
            } else {
                alert(`댓글 삭제에 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
            alert("서버와의 연결에 실패했습니다.");
        }
    };

    // 태그 배열을 <span>으로 감싸서 렌더링하는 함수
    const renderTags = (tags) => {
        if (!tags || tags.length === 0) {
            return "태그 없음";
        }
        return tags.map((tag, index) => (
            <em key={index}>
                {tag}
            </em>
        ));
    };

    // 리뷰 종류를 문자열로 변환하는 함수
    const getReviewTypeLabel = (reviewType) => {
        switch (reviewType) {
            case 'ty1':
                return '여행지';
            case 'ty2':
                return '음식점';
            case 'ty3':
                return '축제';
            default:
                return '알 수 없음';
        }
    };

    //리뷰 삭제
    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await axiosInstance.delete(`/review/${reviewId}`);
            if (response.status === 200 || response.status === 204) {
                alert("리뷰가 성공적으로 삭제되었습니다.");
                setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
                handleBackToList();
            } else {
                alert(`리뷰 삭제에 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error("리뷰 삭제 실패:", error);
            alert("리뷰 삭제 중 오류가 발생했습니다.");
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
                </>
            ) : (
                <>
                    {/* 상세 페이지 */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className='ditail_area'>
                                <h4 className='tit_h4'>{selectedReview?.title || "제목 없음"}</h4>
                                <div className='txt_author'>작성자 : <span className='mr30'>{selectedReview.userName}</span> 
                                                            작성일 : <span>{formatDateOnly(selectedReview.createdAt)}</span></div>                                                            
                                <div className='txt_tags'>리뷰종류 : <span className='mr30'>{getReviewTypeLabel(selectedReview.reviewType)}</span> 
                                                            태그 : <span>{renderTags(selectedReview?.tags)}</span></div>
                                <div className='txt_content'
                                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                />
                                <div className='btn_box'>
                                    {isAuthor && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            className='btn_delect'
                                            onClick={() => handleDeleteReview(selectedReview._id)}
                                        >
                                            삭제
                                        </Button>
                                    )}
                                    <Button variant="contained" color="primary" onClick={handleBackToList}>
                                        목록으로
                                    </Button>
                                </div>
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
                                                secondary={`작성자 : ${comment.userName}`}
                                            />
                                            
                                            <p>작성일 : {formatDate(comment.createdAt)}</p>
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
