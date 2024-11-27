import React, { useState, useRef } from "react";
import { Container, FormControl, FormLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Writing() {
    /* State */
    const [status, setStatus] = useState("ty1");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [errors, setErrors] = useState({});
    const quillRef = useRef(null);

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
            type: status,
            title,
            content,
            tags: tags.split(",").map(tag => tag.trim()), // 태그 배열로 변환
        };

        console.log("Submitted Data:", reviewData);

        try {
            // API 호출 (예시)
            const response = await fetch("http://localhost:3500", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });
            if (response.ok) {
                alert("리뷰가 성공적으로 제출되었습니다!");
                // 상태 초기화
                setStatus("ty1");
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

    /*const handleImageUpload = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append("image", file);

            try {
                // 이미지 업로드 API 호출
                const response = await fetch("https://api.example.com/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();

                const quill = quillRef.current.getEditor(); // Quill 인스턴스 가져오기
                const range = quill.getSelection(); // 현재 커서 위치 가져오기
                quill.insertEmbed(range.index, "image", data.url); // 이미지 삽입
            } catch (error) {
                console.error("Failed to upload image", error);
            }
        };
    };*/

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"], // 이미지 버튼 추가
            ],
            /*handlers: {
                image: handleImageUpload, // 사용자 정의 이미지 업로드 핸들러
            },*/
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
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
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
