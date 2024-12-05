import React, { useState } from "react";
import axios from 'axios';
import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function TourPlanResultMap({ data }) {
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null); // 현재 슬라이드가 열린 항목
    const [expandedData, setExpandedData] = useState(null); // 슬라이드에 표시할 데이터

    if (!data || !data.result || data.result.length === 0) {
        return <div>Loading...</div>;
    }

    const selectedDayLocations = data.result[selectedDay] || [];

    // 중심점 계산 함수
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
        if (expandedItem === index) {
            // 이미 열린 슬라이드 클릭 시 닫기
            setExpandedItem(null);
            setExpandedData(null);
        } else {
            // 새 데이터 로드 및 슬라이드 열기
            const url = `http://localhost:3500/tour/plan/detail?x=${location.mapx}&y=${location.mapy}&title=${encodeURIComponent(location.title)}`;
            try {
                const response = await axios.get(url);
                setExpandedData(response.data.data); // 데이터 저장
                setExpandedItem(index); // 현재 선택된 항목 저장
            } catch (error) {
                console.error("Error fetching location details:", error);
            }
        }
    };

    return (
        <div style={{ display: "flex",width:'100%'}}>
            {/* 좌측 탭 및 여행지 목록 */}
            <div style={{ width: "350px", padding: "20px", borderRight: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
                <h2 style={{ color: "#0fc499", textAlign: "center", marginBottom: "15px" }}>여행 코스</h2>
                {/* 여행 간단 요약 */}
                <div style={{ marginTop: "15px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fff" }}>
                    <h3 style={{ marginBottom: "10px" }}>여행 간단 요약</h3>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "10px" }}>
                        {data.summary.length <= 150
                            ? data.summary
                            : `${data.summary.slice(0, 150)}...`}
                    </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px",border:'1px solid #ccc',borderRadius:'5px',marginTop:'40px',overflow:'hidden'}}>
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
                                border:'0',
                                fontWeight: "bold",
                            }}
                        >
                            {dayIndex + 1}일차
                        </button>
                    ))}
                </div>
                <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "white" }}>
                    <h3 style={{ marginBottom: "10px" }}>Day {selectedDay + 1}</h3>
                    {selectedDayLocations.map((location, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            {/* 장소 목록 */}
                            <div
                                onClick={() => handleLocationClick(location, index)}
                                style={{
                                    padding: "10px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "5px",
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: expandedItem === index ? "#0fc4991f" : "white",
                                    cursor: "pointer",
                                }}
                            >
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

                            {/* 슬라이드 컨텐츠 */}
                            {expandedItem === index && expandedData && (
                                <div
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ff4081",
                                        borderRadius: "5px",
                                        marginTop: "5px",
                                        backgroundColor: "#fff",
                                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                        transition: "max-height 0.3s ease",
                                    }}
                                >
                                    {/* 주소 */}
                                    <p><strong>주소:</strong> {expandedData.address || "정보 없음"}</p>
                                    {expandedData.addressNumber && (
                                        <p><strong>지번 주소:</strong> {expandedData.addressNumber}</p>
                                    )}

                                    {/* 운영 시간 */}
                                    <p><strong>운영 시간:</strong></p>
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

                                    {/* 휴무일 */}
                                    {expandedData.offDays && (
                                        <p><strong>휴무일:</strong> {expandedData.offDays}</p>
                                    )}

                                    {/* 연락처 */}
                                    {expandedData.contactNumber && (
                                        <p><strong>연락처:</strong> {expandedData.contactNumber}</p>
                                    )}
                                    
                                    {/* 시설 */}
                                    {expandedData.facilities && expandedData.facilities.length > 0 && (
                                        <p>
                                            <strong>시설:</strong> {expandedData.facilities.join(", ")}
                                        </p>
                                    )}

                                    {/* 메뉴 */}
                                    {expandedData.menu && expandedData.menu.length > 0 && (
                                        <div>
                                            <p><strong>메뉴:</strong></p>
                                            <ul>
                                                {expandedData.menu.map((menuItem, i) => (
                                                    <li key={i}>
                                                        {menuItem.name} - {menuItem.price || "가격 정보 없음"}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 평점 */}
                                    <p>
                                        <strong>평점:</strong> {expandedData.ratingInfo?.rating || "평점 정보 없음"}
                                    </p>
                                    
                                    <p>
                                        <strong>상세 정보 확인 :</strong> <a href={expandedData.placeUrl || "평점 정보 없음"}></a>
                                    </p>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>

            {/* 우측 지도 */}
            <div style={{ flex: 1 }}>
                <Map center={center} style={{ width: "100%", height: "600px" }} level={7}>
                    {selectedDayLocations.map((location, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: parseFloat(location.mapy),
                                lng: parseFloat(location.mapx),
                            }}
                            onClick={() => setSelectedMarker(index)}
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
                                    {location.firstimage2 && (
                                        <img
                                            src={location.firstimage2}
                                            alt={location.title}
                                            style={{ width: "100px", height: "100px" }}
                                        />
                                    )}
                                </div>
                            )}
                        </MapMarker>
                    ))}
                </Map>
            </div>
        </div>
    );
}
