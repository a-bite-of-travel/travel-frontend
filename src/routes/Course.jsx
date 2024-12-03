
import * as React from 'react';
import {
    Stack,
    Container,
    Button,
    Box,
    Grid,
} from '@mui/material';

export default function Course() {

    return (
        //여행코스
        <Container id="container" className="course" maxWidth={false} sx={{ height: 'calc(100vh - 50px)' }}>
            <Grid container sx={{height: '100%' }}>
                <Grid item sx={{width: 450, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Grid sx={{ backgroundColor: '#FF0A73', padding: 3 }} className="courseSummary" >
                        <h2><strong>홍길동</strong>님을 위한 여행코스 </h2>
                        <Box
                            sx={{
                                backgroundColor: 'white',  // 배경색을 흰색으로 설정
                                padding: 3,                // 패딩을 설정 (8px * 4 = 32px)
                                borderRadius: 2,           // 모서리를 둥글게 설정 (8px * 2 = 16px)
                                boxShadow: 3,
                                mt: 2,             // 그림자 설정 (MUI의 기본 box shadow 단계 사용)
                            }}>
                            <Stack direction="row" alignItems="center">
                                <em >1박 2일</em>
                                <ul>
                                    <li>&middot; <strong>총이동거리</strong> : <span>10 km</span></li>
                                    <li>&middot; <strong>여행지역</strong> : <span>강남구~ 관악구</span></li>
                                    <li>&middot; <span>총 8개 여행지/음식점/카페/숙소추천</span></li>
                                </ul>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid className="courseList" sx={{backgroundColor: '#F0F0F0', padding: 3, flexGrow: 1, overflowY: 'auto' }} >


                        <Stack direction="row" justifyContent="flex-end">
                            <Button variant="contained">일정저장</Button>
                        </Stack>
                        <h3>Day1</h3>
                        <ol>
                            <li>
                                <img src="/images/temp3.png" />
                                <p>
                                    <strong>역삼청소년수련관(실내수영..</strong>
                                    <span>서울특별시 강남구 논현로64길 7</span>
                                </p>
                            </li>
                            <li>
                                <img src="/images/temp3.png" />
                                <p>
                                    <strong>역삼청소년수련관(실내수영..</strong>
                                    <span>서울특별시 강남구 논현로64길 7</span>
                                </p>
                            </li>
                        </ol>


                        <h3>Day2</h3>
                        <ol>
                            <li>
                                <img src="/images/temp3.png" />
                                <p>
                                    <strong>역삼청소년수련관(실내수영..</strong>
                                    <span>서울특별시 강남구 논현로64길 7</span>
                                </p>
                            </li>
                            <li>
                                <img src="/images/temp3.png" />
                                <p>
                                    <strong>역삼청소년수련관(실내수영..</strong>
                                    <span>서울특별시 강남구 논현로64길 7</span>
                                </p>
                            </li>
                            <li>
                                <img src="/images/temp3.png" />
                                <p>
                                    <strong>역삼청소년수련관(실내수영..</strong>
                                    <span>서울특별시 강남구 논현로64길 7</span>
                                </p>
                            </li>
                            <li>
                                <img src="/images/temp3.png" />
                                <p>
                                    <strong>역삼청소년수련관(실내수영..</strong>
                                    <span>서울특별시 강남구 논현로64길 7</span>
                                </p>
                            </li>
                            <li>
                                <img src="/images/temp3.png" />
                                <p>
                                    <strong>역삼청소년수련관(실내수영..</strong>
                                    <span>서울특별시 강남구 논현로64길 7</span>
                                </p>
                            </li>
                        </ol>
                    </Grid>
                </Grid>
                <Grid item xs className="map">
                    Map
                </Grid>
            </Grid>
        </Container>

        // 나의여행
        // <Container id="container" className="course myCourse" maxWidth={false} sx={{ height: 'calc(100vh - 50px)' }}>
        //     <Grid container sx={{height: '100%' }}>
        //         <Grid item sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        //             <Grid sx={{ backgroundColor: '#FF0A73', padding: 3 }} className="courseSummary" >
        //                 <h2><strong>홍길동</strong>님을 위한 여행코스 </h2>
        //                 <Box
        //                     sx={{
        //                         backgroundColor: 'white',
        //                         padding: 3,
        //                         borderRadius: 2, 
        //                         boxShadow: 3,
        //                         mt: 2,
        //                     }}>
        //                     <Stack direction="row" alignItems="center">
        //                         <em >1박 2일</em>
        //                         <ul>
        //                             <li>&middot; <strong>총이동거리</strong> : <span>10 km</span></li>
        //                             <li>&middot; <strong>여행지역</strong> : <span>강남구~ 관악구</span></li>
        //                             <li>&middot; <span>총 8개 여행지/음식점/카페/숙소추천</span></li>
        //                         </ul>
        //                     </Stack>
        //                 </Box>
        //             </Grid>
        //             <Grid className="courseList" sx={{ width: 450, backgroundColor: '#F0F0F0', padding: 3, flexGrow: 1, overflowY: 'auto' }} >
        //                 <h3>Day1</h3>
        //                 <ol>
        //                     <li>
        //                         <img src="/images/temp3.png" />
        //                         <p>
        //                             <strong>역삼청소년수련관(실내수영..</strong>
        //                             <span>서울특별시 강남구 논현로64길 7</span>
        //                         </p>
        //                     </li>
        //                     <li>
        //                         <img src="/images/temp3.png" />
        //                         <p>
        //                             <strong>역삼청소년수련관(실내수영..</strong>
        //                             <span>서울특별시 강남구 논현로64길 7</span>
        //                         </p>
        //                     </li>
        //                 </ol>


        //                 <h3>Day2</h3>
        //                 <ol>
        //                     <li>
        //                         <img src="/images/temp3.png" />
        //                         <p>
        //                             <strong>역삼청소년수련관(실내수영..</strong>
        //                             <span>서울특별시 강남구 논현로64길 7</span>
        //                         </p>
        //                     </li>
        //                     <li>
        //                         <img src="/images/temp3.png" />
        //                         <p>
        //                             <strong>역삼청소년수련관(실내수영..</strong>
        //                             <span>서울특별시 강남구 논현로64길 7</span>
        //                         </p>
        //                     </li>
        //                     <li>
        //                         <img src="/images/temp3.png" />
        //                         <p>
        //                             <strong>역삼청소년수련관(실내수영..</strong>
        //                             <span>서울특별시 강남구 논현로64길 7</span>
        //                         </p>
        //                     </li>
        //                     <li>
        //                         <img src="/images/temp3.png" />
        //                         <p>
        //                             <strong>역삼청소년수련관(실내수영..</strong>
        //                             <span>서울특별시 강남구 논현로64길 7</span>
        //                         </p>
        //                     </li>
        //                     <li>
        //                         <img src="/images/temp3.png" />
        //                         <p>
        //                             <strong>역삼청소년수련관(실내수영..</strong>
        //                             <span>서울특별시 강남구 논현로64길 7</span>
        //                         </p>
        //                     </li>
        //                 </ol>
        //                 <Stack direction="row" justifyContent="flex-end">
        //                     <Button variant="contained">일정변경</Button>
        //                 </Stack>
        //             </Grid>
        //         </Grid>
        //     </Grid>
        // </Container>
    );
}