import React, { useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

export default function TourPlanResultMap({data}) {
    const [selectedMarker, setSelectedMarker] = useState(null);

    const tourInfoList = data.data;

    const handleMarkerClick = (index) => {
        if (selectedMarker === index) {
            // 이미 선택된 마커를 다시 클릭하면 닫기
            setSelectedMarker(null);
        } else {
            // 다른 마커를 클릭하면 해당 마커를 선택
            setSelectedMarker(index);
        }
    };

    return (
        <Map
            center={{ lat: tourInfoList[0].mapy, lng: tourInfoList[0].mapx }}
            style={{ width: '1000px', height: '600px' }}
            level={5}
        >
            {tourInfoList.map((location, index) => (
                <MapMarker
                    key={index}
                    position={{
                        lat: parseFloat(location.mapy),
                        lng: parseFloat(location.mapx)
                    }}
                    onClick={() => handleMarkerClick(index)} // 마커 클릭 이벤트
                >
                    {selectedMarker === index && (
                        <div style={{ padding: '5px', color: '#000', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                            <h4>{location.title}</h4>
                            <p>{location.addr}</p>
                            {location.firstimage2 && (
                                <img
                                    src={location.firstimage2}
                                    alt={location.title}
                                    style={{ width: '100px', height: '100px' }}
                                />
                            )}
                        </div>
                    )}
                </MapMarker>
            ))}
        </Map>
    );
}
