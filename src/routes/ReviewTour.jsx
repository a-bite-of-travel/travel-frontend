import React from "react";
import SubTitle from "../components/SubTitle";
import ReviewList from "../components/ReviewList";
import axios from 'axios';
import { useLoaderData } from "react-router-dom";

export default function ReviewTour() {
    const reviews = useLoaderData();

    return (
        <div className="contents_wrap">
            <SubTitle type="ty6" />
            <ReviewList reviews={reviews} />
        </div>
    );
}


export async function loader() {
    try {
        const response = await axios.get("http://localhost:3500/review");
        if (response.status === 200) {
            return response.data.data.review; // 리뷰 데이터 반환
        } else {
            throw new Error("리뷰 데이터를 가져오지 못했습니다.");
        }
    } catch (error) {
        console.error(error);
        throw error; // 오류 발생 시 라우터에서 처리됨
    }
}
