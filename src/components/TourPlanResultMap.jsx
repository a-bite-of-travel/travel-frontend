import React, { useState } from "react";
import axios from "axios";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { ClipLoader } from "react-spinners";
import { Button } from '@mui/material'

export default function TourPlanResultMap({ data }) {
    const [selectedDay, setSelectedDay] = useState(0);

    const [selectedMarker, setSelectedMarker] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null); // 현재 슬라이드가 열린 항목
    const [expandedData, setExpandedData] = useState(null); // 슬라이드에 표시할 데이터
    const [isSlideOpen, setIsSlideOpen] = useState(false); // 파란색 박스 슬라이드 상태
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const [showFullSummary, setShowFullSummary] = useState(false);

    if (!data || !data.result || data.result.length === 0) {
        return <div>Loading...</div>;
    }

    const selectedDayLocations = data.result[selectedDay] || [];

    const calculateMedianCenter = (locations) => {
        if (!locations || locations.length === 0) {
            return { lat: 37.5665, lng: 126.978 }; // 기본값 (서울)
        }

        const lats = locations.map((loc) => parseFloat(loc.mapy)).sort((a, b) => a - b);
        const lngs = locations.map((loc) => parseFloat(loc.mapx)).sort((a, b) => a - b);

        const mid = Math.floor(lats.length / 2);

        return {
            lat: lats.length % 2 === 0 ? (lats[mid - 1] + lats[mid]) / 2 : lats[mid],
            lng: lngs.length % 2 === 0 ? (lngs[mid - 1] + lngs[mid]) / 2 : lngs[mid],
        };
    };

    const center = calculateMedianCenter(selectedDayLocations);

    const handleLocationClick = async (location, index) => {
        if (expandedItem === index && isSlideOpen) {
            // 이미 열린 슬라이드 클릭 시 닫기
            setExpandedItem(null);
            setExpandedData(null);
            setIsSlideOpen(false);
        } else {
            // 로딩 시작
            setIsLoading(true);
            setExpandedItem(index);
            setIsSlideOpen(true);

            // 새 데이터 로드
            const url = `http://localhost:3500/tour/plan/detail?x=${location.mapx}&y=${location.mapy}&title=${encodeURIComponent(location.title)}`;
            try {
                const response = await axios.get(url);
                setExpandedData(response.data.data); // 데이터 저장
            } catch (error) {
                console.error("Error fetching location details:", error);
                setExpandedData(null);
            } finally {
                // 로딩 종료
                setIsLoading(false);
            }
        }
    };

    const handleMarkerClick = (index) => {
        if (selectedMarker === index) {
            // 이미 선택된 마커를 다시 클릭하면 닫기
            setSelectedMarker(null);
        } else {
            // 다른 마커를 클릭하면 해당 마커를 선택
            setSelectedMarker(index);
        }
    };

    const polylinePath = selectedDayLocations.map((location) => ({
        lat: parseFloat(location.mapy),
        lng: parseFloat(location.mapx),
    }));

    const handleOutsideClick = () => {
        setIsSlideOpen(false); // 슬라이드 닫기
        setExpandedItem(null);
        setExpandedData(null);
        setIsLoading(false);
    };

    const handleSaveTour = async () => {

        const requestData = {
            startDate: data.startDate,
            period: data.period,
            theme: data.theme,
            contentid: data.result.map((day) =>
                day.map((location) => (location.contentid))
            ),
            title: data.title
        };

        try {
            // POST 요청을 보냅니다.
            const response = await axios.post("http://localhost:3500/tour/plan", requestData);

            if (response.status === 201) {
                alert("여행이 성공적으로 저장되었습니다!");
            } else {
                alert("여행 저장 중 문제가 발생했습니다.");
            }
        } catch (error) {
            console.error("Error saving tour plan:", error);
            alert("여행 저장 중 에러가 발생했습니다.");
        }
    };

    return (
        <div style={{ display: "flex", width: "100%", position: "relative" }}>
            {/* 좌측 패널 */}
            <div
                style={{
                    width: "350px",
                    padding: "24px",
                    borderRight: "1px solid #ccc",
                    backgroundColor: "#f9f9f9",
                    position: "relative", // 슬라이드 박스가 이 컨테이너를 기준으로 배치됩니다
                }}
            >
                <h2 style={{ color: "#0fc499", textAlign: "center", marginBottom: "15px" }}>여행 코스</h2>
                <div style={{display:'flex',justifyContent:"space-between",alignItems:'center'}}>
                    <p style={{color:'#333'}}>{data.title}</p>
                    <div style={{textAlign:"right"}}>
                        <Button onClick={handleSaveTour}  variant="contained"  sx={{ backgroundColor: 'secondary.main' }}>여행 저장</Button>
                    </div>
                </div>
                {/* 여행 간단 요약 */}
                <div style={{ marginTop: "15px", padding: "15px 20px 15px 20px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fff" }}>
                    <h3 style={{ marginBottom: "10px" }}>여행 간단 요약</h3>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "10px" }}>
                        {showFullSummary || data.summary.length <= 150
                            ? data.summary
                            : `${data.summary.slice(0, 150)}...`}
                    </p>
                    {data.summary.length > 150 && (
                        <div style={{textAlign:'right'}}>
                            <button
                                onClick={() => setShowFullSummary(!showFullSummary)}
                                style={{
                                    padding: "5px 10px",
                                    border: "none",
                                    backgroundColor: "#ff4081",
                                    color: "white",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                {showFullSummary ? "접기" : "더보기"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Day 별 버튼 */}
                <div style={{ display: "flex", justifyContent: "space-around",marginTop:'25px',border:'1px solid #ccc',borderRadius:'5px',overflow:'hidden' ,marginBottom:'8px'}} className="btnDays">
                    {data.result.map((_, dayIndex) => (
                        <button
                            key={dayIndex}
                            onClick={() => setSelectedDay(dayIndex)}
                            style={{
                                flex: 1,
                                padding: "10px",
                                cursor: "pointer",
                                backgroundColor: selectedDay === dayIndex ? "#0fc499" : "#fff",
                                color: selectedDay === dayIndex ? "white" : "black",
                                border:  "0 none",
                                fontWeight: "bold",
                            }}
                        >
                            {dayIndex + 1}일차
                        </button>
                    ))}
                </div>

                {/* Day별 여행지 목록 */}
                <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "white" }}>
                    <h3 style={{ marginBottom: "10px" }}>Day {selectedDay + 1}</h3>
                    {selectedDayLocations.map((location, index) => (
                        <div
                            key={index}
                            onClick={() => handleLocationClick(location, index)}
                            style={{
                                padding: "10px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                backgroundColor: expandedItem === index ? "#f9f9f9" : "white",
                                cursor: "pointer",
                                display: "flex", // 썸네일과 텍스트를 나란히 배치
                                alignItems: "center",
                            }}
                        >
                            {/* 썸네일 이미지 */}
                            {location.firstimage2 && (
                                <img
                                    src={location.firstimage2}
                                    alt={location.title}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "5px",
                                        marginRight: "10px",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: "0 0 5px 0" }}>{location.title}</h4>
                                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>{location.addr}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 슬라이드 박스 */}
                {isSlideOpen && (
                    <div className="moreView"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "100%", // 목록 바로 옆에 붙도록 설정
                            width: "300px",
                            height: "100%",
                            backgroundColor: "#ffffff",
                            color: "black",
                            overflowY: "auto",
                            padding: "50px 24px 24px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            zIndex: 10,
                        }}
                    >
                        <button
                            onClick={handleOutsideClick}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            ×
                        </button>
                        {isLoading ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <ClipLoader color="#0fc499" size={50} />
                            </div>
                        ) : expandedData ? (
                            <div className="inner">
                                {/* 주소 */}
                                <p><strong>주소:</strong><span> {expandedData.address || "정보 없음"}</span></p>
                                {expandedData.addressNumber && (
                                    <p><strong>지번 주소:</strong> <span>{expandedData.addressNumber}</span></p>
                                )}
                                {/* 운영 시간 */}
                                <p>
                                    <strong>운영 시간:</strong>
                                    <ul>
                                        {expandedData.operationHours && expandedData.operationHours.length > 0
                                            ? expandedData.operationHours
                                                .filter((item) => item.day || item.time)
                                                .map((item, i) => (
                                                    <li key={i}>
                                                        {item.day ? `${item.day}: ` : ""}
                                                        {item.time || "시간 정보 없음"}
                                                    </li>
                                                ))
                                            : "운영 시간 정보 없음"}
                                    </ul>
                                </p>
                                {/* 휴무일 */}
                                {expandedData.offDays && (
                                    <p><strong>휴무일:</strong><span> {expandedData.offDays}</span></p>
                                )}
                                {/* 연락처 */}
                                {expandedData.contactNumber && (
                                    <p><strong>연락처:</strong> <span>{expandedData.contactNumber}</span></p>
                                )}

                                {/* 시설 */}
                                {expandedData.facilities && expandedData.facilities.length > 0 && (
                                    <p>
                                        <strong>시설:</strong> <span>{expandedData.facilities.join(", ")}</span>
                                    </p>
                                )}
                                {/* 메뉴 */}
                                {expandedData.menu && expandedData.menu.length > 0 && (
                                    <p>
                                        <strong>메뉴:</strong>
                                        <ul>
                                            {expandedData.menu.map((menuItem, i) => (
                                                <li key={i}>
                                                    {menuItem.name} - {menuItem.price || "가격 정보 없음"}
                                                </li>
                                            ))}
                                        </ul>
                                    </p>
                                )}
                                {/* 평점 */}
                                <p>
                                    <strong>평점:</strong><span> <span>{expandedData.ratingInfo?.rating || "평점 정보 없음"}</span></span>
                                </p>

                                <div style={{textAlign:'right',marginTop:'24px'}}>
                                    <a href={expandedData.placeUrl} target="_blank" rel="noopener noreferrer">
                                        <strong>상세 정보 확인</strong>
                                    </a>

                                </div>
                            </div>
                        ) : (
                            <div>데이터를 불러오지 못했습니다.</div>
                        )}
                    </div>
                )}
            </div>

            {/* 지도 */}
            <div style={{ flex: 1 }}>
                <Map center={center} style={{ width: "100%", height: "100%" }} level={6}>
                    <Polyline
                        path={[polylinePath]}
                        strokeWeight={5}
                        strokeColor="#ff4081"
                        strokeOpacity={0.8}
                        strokeStyle="solid"
                    />
                    {selectedDayLocations.map((location, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: parseFloat(location.mapy),
                                lng: parseFloat(location.mapx),
                            }}
                            onClick={() => handleMarkerClick(index)}
                        >
                            {selectedMarker === index && (
                                <div
                                    style={{
                                        padding: "5px",
                                        color: "#000",
                                        backgroundColor: "white",
                                        borderRadius: "5px",
                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                                    }}
                                >
                                    <h4>{location.title}</h4>
                                    <p>{location.addr}</p>
                                </div>
                            )}
                        </MapMarker>
                    ))}
                </Map>
            </div>
        </div>
    );
}