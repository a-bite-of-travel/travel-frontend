import React, { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function TourPlanResultMap({ data }) {
    const [selectedDay, setSelectedDay] = useState(0); // 선택된 날짜
    const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 상태
    const [showFullSummary, setShowFullSummary] = useState(false); // 요약 확장 상태

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

    const handleMarkerClick = (index) => {
        if (selectedMarker === index) {
            setSelectedMarker(null); // 이미 선택된 마커를 다시 클릭하면 닫기
        } else {
            setSelectedMarker(index); // 다른 마커를 클릭하면 해당 마커를 선택
        }
    };

    const handleDayClick = (dayIndex) => {
        setSelectedDay(dayIndex); // 클릭한 날짜로 상태 업데이트
        setSelectedMarker(null); // 마커 초기화
    };

    return (
        <div style={{ display: "flex" }}>
            {/* 좌측 탭 및 여행지 목록 */}
            <div style={{ width: "350px", padding: "10px", borderRight: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
                <h2 style={{ color: "#ff4081", textAlign: "center", marginBottom: "20px" }}>
                    여행 코스
                </h2>
                {/* 여행 간단 요약 */}
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
                    <h3 style={{ marginBottom: "10px" }}>여행 간단 요약</h3>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "10px" }}>
                        {showFullSummary || data.summary.length <= 150
                            ? data.summary
                            : `${data.summary.slice(0, 150)}...`}
                    </p>
                    {data.summary.length > 150 && (
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
                    )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
                    {data.result.map((_, dayIndex) => (
                        <button
                            key={dayIndex}
                            onClick={() => handleDayClick(dayIndex)}
                            style={{
                                flex: 1,
                                padding: "10px",
                                cursor: "pointer",
                                backgroundColor: selectedDay === dayIndex ? "#ff4081" : "#f0f0f0",
                                color: selectedDay === dayIndex ? "white" : "black",
                                border: "none",
                                borderBottom: selectedDay === dayIndex ? "none" : "2px solid #ccc",
                                borderRadius: "5px 5px 0 0",
                                fontWeight: "bold"
                            }}
                        >
                            {dayIndex + 1}일차
                        </button>
                    ))}
                </div>
                <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "white" }}>
                    <h3 style={{ marginBottom: "10px" }}>Day {selectedDay + 1}</h3>
                    {selectedDayLocations.map((location, index) => (
                        <div
                            key={index}
                            style={{
                                padding: "10px",
                                marginBottom: "10px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "5px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "white",
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
                                <div>
                                    <span
                                        style={{
                                            padding: "2px 5px",
                                            borderRadius: "5px",
                                            backgroundColor: location.isParking ? "#d4edda" : "#f8d7da",
                                            color: location.isParking ? "#155724" : "#721c24",
                                            marginRight: "5px",
                                            fontSize: "12px"
                                        }}
                                    >
                                        {location.isParking ? "주차 가능" : "주차 불가능"}
                                    </span>
                                    <span
                                        style={{
                                            padding: "2px 5px",
                                            borderRadius: "5px",
                                            backgroundColor: location.isOpen ? "#d4edda" : "#f8d7da",
                                            color: location.isOpen ? "#155724" : "#721c24",
                                            fontSize: "12px"
                                        }}
                                    >
                                        {location.isOpen ? "영업 중" : "쉬는날"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 우측 지도 */}
            <div style={{ flex: 1 }}>
                <Map
                    center={center} // 계산된 중심점 사용
                    style={{ width: "100%", height: "600px" }}
                    level={7}
                >
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
