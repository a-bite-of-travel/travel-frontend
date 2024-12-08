import React, { useState, useRef, useMemo } from "react";
import { Container, FormControl, FormLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Writing() {
    const [reviewType, setReviewType] = useState("ty1");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [errors, setErrors] = useState({});
    const quillRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

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
            tags: tags.split(",").map((tag) => tag.trim()),
        };

        try {
            const response = await axiosInstance.post("/review", reviewData);
            if (response.status === 200 || response.status === 201) {
                alert("리뷰가 성공적으로 제출되었습니다!");
                setReviewType("ty1");
                setTitle("");
                setContent("");
                setTags("");
                setErrors({});
                navigate("/review");
            } else {
                alert(`리뷰 제출에 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error("리뷰 제출 실패:", error);
            alert("리뷰 제출 중 문제가 발생했습니다.");
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (value) => {
        setContent(value);
    };

    const handleTagsChange = (e) => {
        setTags(e.target.value);
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                ],
            },
        }),
        []
    );

    const formats = useMemo(
        () => ["header", "bold", "italic", "underline", "list", "bullet", "link", "image"],
        []
    );

    return (
        <Container maxWidth="lg">
            <form onSubmit={handleSubmit} className="writing_area">
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

                <FormControl fullWidth margin="normal" error={!!errors.title}>
                    <FormLabel htmlFor="review-title">제목</FormLabel>
                    <TextField
                        id="review-title"
                        placeholder="제목을 입력해주세요."
                        value={title}
                        onChange={handleTitleChange}
                        helperText={errors.title}
                        className="inp_box"
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.content}>
                    <FormLabel htmlFor="review-content">내용</FormLabel>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        placeholder="내용을 입력하세요."
                    />
                    {errors.content && <p style={{ color: "red" }}>{errors.content}</p>}
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.tags}>
                    <FormLabel htmlFor="review-tags">태그 달기</FormLabel>
                    <TextField
                        id="review-tags"
                        placeholder="태그를 쉼표로 구분하여 입력해주세요."
                        value={tags}
                        onChange={handleTagsChange}
                        helperText={errors.tags}
                        className="inp_box"
                    />
                </FormControl>

                <div className="btn_area">
                    <Button variant="contained" color="primary" type="submit">
                        제출
                    </Button>
                </div>
            </form>
        </Container>
    );
}
