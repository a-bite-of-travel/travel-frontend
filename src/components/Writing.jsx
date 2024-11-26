import * as React from 'react';
import { Stack, Container, Button, FormControl, FormControlLabel, FormLabel, Select, TextField, MenuItem, FormHelperText, Dialog, DialogTitle, DialogContent, DialogContentText, Box, DialogActions } from '@mui/material';

export default function Writing() {
    /* select */
    const [reviewType, setReviewType] = React.useState('10');

    const handleChange = (event) => {
        setReviewType(event.target.value);
    };

    return (
        <Container maxWidth="lg">
            <div className="writing_area">
                <FormControl>
                    <FormLabel id="review-select-label">리뷰선택</FormLabel>
                    <Select
                        labelId="review-select-label"
                        id="review-select"
                        value={reviewType}
                        onChange={handleChange}>
                        <MenuItem value={10}>여행지</MenuItem>
                        <MenuItem value={20}>음식점</MenuItem>
                        <MenuItem value={30}>리뷰</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel id="revie-input-label1">제목</FormLabel>
                    <TextField labelId="revie-input-label1" id="review-input1" placeholder="내용을 입력해주세요." />
                </FormControl>
                <FormControl>
                    <FormLabel id="">내용</FormLabel>
                </FormControl>
                <FormControl>
                    <FormLabel id="revie-input-label2">태그달기</FormLabel>
                    <TextField labelId="revie-input-label2" id="review-input2" placeholder="태그를 입력해주세요." />
                </FormControl>
            </div>
        </Container>
    );
}