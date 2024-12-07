import React, { useState, useRef } from "react";
import { Container, FormControl, FormLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import axiosInstance from "../utils/axiosInstance";

export default function Writing() {
    /* State */
    const [reviewType, setReviewType] = useState("ty1");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // 초기 값은 빈 문자열
    const [tags, setTags] = useState("");
    const [errors, setErrors] = useState({});
    const quillRef = useRef(null);
    const navigate = useNavigate(); // useNavigate 훅 사용

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

        const reviewData = {
            reviewType,
            title,
            content,
            tags: tags.split(",").map(tag => tag.trim()),  //태그 배열로 변환
        };

        try {
            // API 호출
            const response = await axiosInstance.post("/review", reviewData);
            if (response.status === 200 || response.status === 201) {
                alert("리뷰가 성공적으로 제출되었습니다!");
                // 상태 초기화
                setReviewType("ty1");
                setTitle("");
                setContent("");
                setTags("");
                setErrors({});
                navigate("/review"); // 제출 완료 후 /review 경로로 이동
            } else {
                alert(`리뷰 제출에 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            if (error.response) {
                console.error("서버 응답 데이터:", error.response.data);
                alert(`리뷰 제출 중 오류가 발생했습니다: ${error.response.data.message}`);
            } else {
                alert("서버와 통신 중 문제가 발생했습니다.");
            }
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
    ];

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
                        className="select_box"
                    >
                        <MenuItem value="ty1">여행지</MenuItem>
                        <MenuItem value="ty2">음식점</MenuItem>
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
                        className="inp_box"
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
                        className="inp_box"
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
