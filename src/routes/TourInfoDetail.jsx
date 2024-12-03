import { Box, Button, Grid, List, ListItem, ListItemText, TextField, Container, Divider, Typography } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';

export default function TourInfoDetail() {
    const detail = useLoaderData();

    // HTML 문자열을 렌더링하는 함수
    const renderHTML = (htmlString) => {
        return { __html: htmlString };
    };

    return (
        <div className="contents_wrap">
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="ditail_area">
                            {/* 제목 */}
                            <h4 className="tit_h4">{detail.title}</h4>

                            {/* 이미지와 설명 */}
                            <div className="txt_content" style={{ textAlign: 'left' }}>
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <img
                                        src={detail.firstimage}
                                        alt=""
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            margin: '0 auto',
                                            display: 'block',
                                        }}
                                    />
                                </div>
                                <p>{detail.overview}</p>
                            </div>

                            {/* 구분선 */}
                            <Divider sx={{ my: 3 }} />

                            {/* 상세 정보 섹션 */}
                            <div className="detail_info">
                                <Grid container spacing={2} sx={{ lineHeight: 2 }}>
                                    <Grid item xs={6}>
                                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                            <li><strong>문의 및 안내:</strong> {detail.detailinfo[0].infocenter || '정보 없음'}</li>
                                            <li><strong>주소:</strong> {detail.addr || '정보 없음'}</li>
                                            <li><strong>휴일:</strong> {detail.detailinfo[0].restdate || '정보 없음'}</li>
                                        </ul>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                            <li>
                                                <strong>홈페이지:</strong>{' '}
                                                <span
                                                    dangerouslySetInnerHTML={renderHTML(detail.homepage || '정보 없음')}
                                                />
                                            </li>
                                            <li><strong>이용시간:</strong> {detail.detailinfo[0].usetime || '정보 없음'}</li>
                                            <li><strong>주차:</strong> {detail.detailinfo[0].parking || '정보 없음'}</li>
                                        </ul>
                                    </Grid>
                                </Grid>
                            </div>

                            {/* "목록으로" 버튼 */}
                            <Button variant="contained" color="primary">
                                목록으로
                            </Button>
                        </div>

                        {/* 댓글 영역 */}
                        <Divider sx={{ my: 3 }} />
                        <div className="comment_area">
                            <div className="comment_box">
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="댓글을 입력하세요"
                                    />
                                    <Button variant="contained" color="primary">
                                        댓글<br />달기
                                    </Button>
                                </Box>
                            </div>

                            <List sx={{ mb: 2 }}>
                                <ListItem sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <ListItemText secondary={`작성일: 22323`} />
                                    <p>작성자 :</p>
                                    <Button size="small" color="error">
                                        삭제
                                    </Button>
                                </ListItem>
                            </List>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export async function loader({ request, params }) {
    const { contentid } = params;
    const detail = await axios.get(`http://localhost:3500/tour/info/${contentid}?contenttypeid=12`);
    return detail.data.data;
}
