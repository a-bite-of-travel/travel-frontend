import { Container } from '@mui/material'
import React from "react";

export default function SubTitle({type}) {
    const titles = {
        ty1:"여행지",
        ty2:"음식점",
        ty3:"축제",
        ty4:"후기작성",
        ty5:"My Page",
    };
    return (
        <div className="tit_imgwrap">
            <Container maxWidth="lg">
                <div className={`tit_img ${type}`}>{titles[type]}</div>
            </Container>
        </div>
    );
}