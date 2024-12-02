import { Container } from '@mui/material'
import React from "react";

export default function SubTitle({type}) {
    const titles = {
        ty1:"여행지",
        ty2:"음식점",
        ty3:"축제",
        ty4:"리뷰 작성",
        ty5:"My Page",
        ty6:"리뷰 목록",
    };
    return (
        <div className="tit_imgwrap">
            <Container maxWidth="lg">
                <div className={`tit_img ${type}`}>{titles[type]}</div>
            </Container>
        </div>
    );
}