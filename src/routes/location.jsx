import React from "react";
import SubTitle from "../components/SubTitle";
import ReviewList from "../components/ReviewList";

export default function Review() {
    return (
        <div className="contents_wrap">
            <SubTitle type="ty1" />
            <ReviewList type="ty1" />
        </div>
    );
}