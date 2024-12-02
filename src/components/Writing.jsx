import React, { useState, useRef } from "react";
import { Container, FormControl, FormLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

export default function Writing() {
    /* State */
    const [reviewType, setReviewType] = useState("ty1");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // 초기 값은 빈 문자열
    const [tags, setTags] = useState("");
    const [errors, setErrors] = useState({});
    const quillRef = useRef(null);

    // HTML 태그 제거 함수
    const stripHtml = (html) => {
        return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }); // 모든 태그 제거
    };

    /* Handlers */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 폼 검증
        const validationErrors = {};
        if (!title) validationErrors.title = "제목을 입력해주세요.";
        if (!content) validationErrors.content = "내용을 입력해주세요.";
        if (!tags) validationErrors.tags = "태그를 입력해주세요.";
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // 태그가 제거된 텍스트 콘텐츠를 사용
        const strippedContent = stripHtml(content);

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDQyNDUwM2FhM2I0ZjlkZjM0NTM3MCIsImVtYWlsIjoiYjEyMzRAdGVzdC5jb20iLCJpYXQiOjE3MzI1MTkwMjUsImV4cCI6MTczMzcyODYyNX0.MUTqtCUJL4z0c3NSKQ7op9IgFQMXRzatJUc2snhLt0A";

        const reviewData = {
            reviewType,
            title,
            content: strippedContent, // 태그가 제거된 내용 사용
            tags: tags.split(",").map(tag => tag.trim()), // 태그 배열로 변환
        };

        console.log("Submitted Data:", reviewData);

        try {
            // API 호출
            /*const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("토큰이 없습니다.");
                alert("로그인 후 이용해주세요.");
                return;
            }*/
            const response = await fetch("http://localhost:3500/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });
            if (response.ok) {
                alert("리뷰가 성공적으로 제출되었습니다!");
                setReviewType("ty1");
                setTitle("");
                setContent("");
                setTags("");
                setErrors({});
            } else {
                alert("리뷰 제출에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("서버와 통신 중 문제가 발생했습니다.");
        }
    };



    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"], 
            ],
        },
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
        "image",
    ]

    return (
        <Container maxWidth="lg">
            <form onSubmit={handleSubmit} className="writing_area">
                {/* 리뷰 선택 */}
                <FormControl fullWidth margin="normal">
                    <FormLabel htmlFor="review-select">리뷰 선택</FormLabel>
                    <Select
                        id="review-select"
                        value={reviewType}
                        onChange={(e) => setReviewType(e.target.value)}
                    >
                        <MenuItem value="ty1">여행지</MenuItem>
                        <MenuItem value="ty2">음식점</MenuItem>
                        <MenuItem value="ty3">축제</MenuItem>
                    </Select>
                </FormControl>

                {/* 제목 입력 */}
                <FormControl fullWidth margin="normal" error={!!errors.title}>
                    <FormLabel htmlFor="review-title">제목</FormLabel>
                    <TextField
                        id="review-title"
                        placeholder="제목을 입력해주세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        helperText={errors.title}
                    />
                </FormControl>

                {/* 내용 입력 */}
                <FormControl fullWidth margin="normal" error={!!errors.content}>
                    <FormLabel htmlFor="review-content">내용</FormLabel>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder="내용을 입력하세요."
                    />
                    {errors.content && <p style={{ color: "red" }}>{errors.content}</p>}
                </FormControl>

                {/* 태그 입력 */}
                <FormControl fullWidth margin="normal" error={!!errors.tags}>
                    <FormLabel htmlFor="review-tags">태그 달기</FormLabel>
                    <TextField
                        id="review-tags"
                        placeholder="태그를 쉼표로 구분하여 입력해주세요."
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        helperText={errors.tags}
                    />
                </FormControl>

                {/* 제출 버튼 */}
                <div className="btn_area">
                    <Button variant="contained" color="primary" type="submit">
                        제출
                    </Button>
                </div>
            </form>
        </Container>
    );
}
