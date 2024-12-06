import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    Stack,
    Box
} from '@mui/material';

export default function Myplan() {
    return (
        <Container maxWidth="lg" id="container" className="myPlan">
            <List className='tour_box'>              
                <ListItem  sx={{mb:2,border:'1px solid #f0f0f0'}}>
                    <Box
                        component="img"
                        src={'https://tong.visitkorea.or.kr/cms/resource/57/3396257_image3_1.JPG'}
                        alt={'서울 금천구 여행'}
                        className='img_box'
                    />
                    <div>
                        <ListItemText
                            primary={<Typography variant="h6">서울 금천구 여행</Typography>}
                            secondary={
                                <Typography variant="body2" color="textSecondary" noWrap>
                                    여행설명입니다. 여행설명입니다. <br/>여행설명입니다. 여행설명입니다. 여행설명입니다. 여행설명입니다.
                                </Typography>
                            }
                        />
                        <ListItemText
                            secondary={
                                <Typography variant="body2" color="textSecondary" noWrap>
                                    2024년 12월 06일 /  1박 2일
                                </Typography>
                            }
                        />
                        <Stack direction="row" spacing={1} sx={{mt:2}} className="chips">
                            <Chip label="자연즐기기" color="thema1" />
                            <Chip label="역사탐방" color="thema2" />
                            <Chip label="신나게놀기" color="thema3" />
                            <Chip label="신나게놀기" color="thema4" />
                            <Chip label="신나게놀기" color="thema5" />
                            <Chip label="신나게놀기" color="thema6" />
                            <Chip label="신나게놀기" color="thema7" />
                        </Stack>
                    </div>
                </ListItem>
            </List>
        </Container >
    )
}