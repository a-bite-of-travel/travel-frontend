import {Box, Button, Grid, List, ListItem, ListItemText, TextField, Container} from '@mui/material';
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {useLoaderData, useSubmit, redirect  } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {useAuth} from '../context/AuthContext';

export default function ReviewTourDetail(){
    const review = useLoaderData();
    const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
    const submit = useSubmit(); // React Router's useSubmit
    const [newComment, setNewComment] = useState(""); // 댓글 내용 상태 관리

    let isAuthor;
    if(user) {
        isAuthor = user.id == review.userId;
    }

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

    const formatDateOnly = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

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

    const sanitizedContent = DOMPurify.sanitize(review?.content || "", {
        ALLOWED_TAGS: [
            'img', 'strong', 'ul', 'li', 'ol', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'em', 'a'
        ],
        ALLOWED_ATTR: [
            'src', 'alt', 'title', 'width', 'height', 'class', 'style', 'href', 'target'
        ]
    });

    const handleDeleteReview = () => {
        if (!isAuthor) {
            alert("작성자만 삭제할 수 있습니다.");
            return;
        }

        if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
            const formData = new FormData();
            formData.append("actionType", "deleteReview");
            formData.append("reviewId", review._id);

            // React Router의 submit 호출
            submit(formData, { method: "delete" });
        }
    };

    const handleBackToList = () => {
        // setSelectedReview(null); // 선택된 리뷰 초기화
    };

    // 댓글 추가
    const handleAddComment = (e) => {
        e.preventDefault();

        if (newComment.trim() === "") {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("actionType", "addComment");
        formData.append("content", newComment);

        submit(formData, { method: "post" }); // React Router의 submit 호출
        setNewComment(""); // 입력 필드 초기화
    };

    // 댓글 삭제
    const handleDeleteComment = (commentId) => {
        const formData = new FormData();
        formData.append("actionType", "deleteComment");
        formData.append("commentId", commentId);

        // React Router의 submit 호출
        submit(formData, { method: "delete" });
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

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div className='ditail_area'>
                        <h4 className='tit_h4'>{review?.title || "제목 없음"}</h4>
                        <div className='txt_author'>작성자 : <span className='mr30'>{review.userName}</span>
                            작성일 : <span>{formatDateOnly(review.createdAt)}</span></div>
                        <div className='txt_tags'>리뷰종류 : <span className='mr30'>{getReviewTypeLabel(review.reviewType)}</span>
                            태그 : <span>{renderTags(review?.tags)}</span></div>
                        <div className='txt_content'
                             dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                        <div className='btn_box'>
                            {isAuthor && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    className='btn_delect'
                                    onClick={() => handleDeleteReview(review._id)}
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
                            <form onSubmit={handleAddComment}>
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
                            </form>
                        </div>

                        <List sx={{ mb: 2 }}>
                            {review.comments.map((comment) => (
                                <ListItem
                                    key={comment._id} // 고유한 key 추가
                                    sx={{ borderBottom: "1px solid #e0e0e0" }}
                                >
                                    <ListItemText
                                        primary={comment.content}
                                        secondary={`작성자 : ${comment.userName}`}
                                    />

                                    <p>작성일 : {formatDate(comment.createdAt)}</p>
                                    {isAuthor && (
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteComment(comment._id)}
                                        >
                                            삭제
                                        </Button>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Grid>
            </Grid>
        </Container>

    );
}

export async function loader({ params }) {
    const { reviewId } = params;
    const response = await axiosInstance.get(`/review/${reviewId}`);
    return response.data.data;
}

export async function action({ params, request }) {
    const { reviewId } = params;
    const formData = await request.formData();
    const actionType = formData.get("actionType"); // 작업 유형 확인
    const method = request.method.toLowerCase();

    if (method === "post") {
        if (actionType === "addComment") {
            // 댓글 추가
            const content = formData.get("content");
            try {
                const response = await axiosInstance.put(`/review/${reviewId}/comments`, { content });
                if (response.status === 201) {
                    return response.data;
                }
            } catch (error) {
                console.error("댓글 추가 실패:", error);
                throw new Error("댓글 추가에 실패했습니다.");
            }
        }
    } else if (method === "delete") {
        if (actionType === "deleteComment") {
            // 댓글 삭제
            const commentId = formData.get("commentId");
            try {
                const response = await axiosInstance.delete(`/review/comments/${commentId}`);
                if (response.status === 204) {
                    return { success: true };
                }
            } catch (error) {
                console.error("댓글 삭제 실패:", error);
                throw new Error("댓글 삭제에 실패했습니다.");
            }
        } else if (actionType === "deleteReview") {
            // 리뷰 삭제
            try {
                const response = await axiosInstance.delete(`/review/${reviewId}`);
                if (response.status === 204) {
                    return redirect("/tourinfo"); // 성공 시 목록 페이지로 이동
                }
            } catch (error) {
                console.error("리뷰 삭제 실패:", error);
                throw new Error("리뷰 삭제에 실패했습니다.");
            }
        }
    }
}
