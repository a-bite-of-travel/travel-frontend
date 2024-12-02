import React, { useEffect } from "react";
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Grid,
    Link
} from '@mui/material';

export default function Main() {
    useEffect(() => {
        const images = document.querySelectorAll("#container .bg-image");
        let currentIndex = 0;
        let timeoutId;

        const changeImage = () => {
            // 현재 이미지를 투명하게 처리
            images[currentIndex].style.opacity = 0;

            // 다음 이미지 인덱스를 계산
            currentIndex = (currentIndex + 1) % images.length;

            // 다음 이미지를 보이게 처리
            images[currentIndex].style.opacity = 1;

            // 일정 시간 후 다음 이미지로 전환
            timeoutId = setTimeout(changeImage, 5000); // 5초 간격
        };

        // 첫 번째 이미지를 보이게 설정하고 시작
        images[currentIndex].style.opacity = 1;
        timeoutId = setTimeout(changeImage, 5000);

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearTimeout(timeoutId);
    }, []);


    return (
        <Container maxWidth={false} id="container" className="bg-main">
            <div className="bg-image bg1"></div>
            <div className="bg-image bg2"></div>
            <div className="bg-image bg3"></div>
            <Container maxWidth="lg">
                <Grid container alignItems="center" sx={{ height: '100vh' }}>
                     <Grid item xs={12}>
                         <p>대한민국 수도서울<br/>나만의 맞춤여행을 지금 시작하세요!</p>
                         <Link component={RouterLink} to="/" >여행하러 가기</Link>
                     </Grid>
                </Grid>
            </Container>
        </Container>
    );
}