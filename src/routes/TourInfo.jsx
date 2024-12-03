import axios from 'axios';
import { useLoaderData, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TourInfo() {
    const { tourCodeList, tourInfoList, totalCount } = useLoaderData();
    const { sigungu } = tourCodeList;
    const location = useLocation(); // 현재 경로를 감지
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState('');
    const [selectedRegions, setSelectedRegions] = useState([]);

    const ITEMS_PER_PAGE = 20; // 한 페이지당 항목 수 (백엔드 고정)
    const MAX_PAGE_DISPLAY = 10; // 최대 페이지 번호 표시
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE); // 총 페이지 수

    // Reset state when path changes
    useEffect(() => {
        setSelectedRegions([]);
        setSearchText('');
        setSearchParams(new URLSearchParams({ page: '1' })); // 페이지를 1로 초기화
    }, [location.pathname]); // 경로 변경 시 실행

    // Handle region selection
    const toggleRegionSelection = (regionCode) => {
        const newRegions = selectedRegions.includes(regionCode)
            ? selectedRegions.filter((code) => code !== regionCode)
            : [...selectedRegions, regionCode];

        setSelectedRegions(newRegions);

        const params = new URLSearchParams(searchParams);
        if (newRegions.length > 0) {
            params.set('region', newRegions.join(','));
        } else {
            params.delete('region');
        }
        params.set('page', '1'); // 지역 선택 시 첫 페이지로 이동
        setSearchParams(params, { replace: true });
    };

    // Handle search input change
    const handleSearchChange = (e) => setSearchText(e.target.value);

    // Handle form submission for search
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);
        if (searchText) {
            params.set('searchText', searchText);
        } else {
            params.delete('searchText');
        }
        params.set('page', '1'); // 검색 시 첫 페이지로 이동
        setSearchParams(params, { replace: true });
    };

    // Handle page change
    const goToPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        setSearchParams(params, { replace: true });
    };

    // Calculate page range for display
    const startPage = Math.floor((currentPage - 1) / MAX_PAGE_DISPLAY) * MAX_PAGE_DISPLAY + 1;
    const endPage = Math.min(startPage + MAX_PAGE_DISPLAY - 1, totalPages);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <>
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="검색어를 입력하세요"
                />
                <button type="submit">검색</button>
            </form>

            <p>지역 선택</p>
            {sigungu.map((region) => (
                <div key={region.code}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedRegions.includes(region.code)}
                            onChange={() => toggleRegionSelection(region.code)}
                        />
                        {region.name}
                    </label>
                </div>
            ))}

            <p>여행 정보</p>
            {tourInfoList.map((info) => (
                <div key={info._id}>{info.title}</div>
            ))}

            <div className="pagination">
                <button
                    onClick={() => goToPage(Math.max(startPage - 1, 1))}
                    disabled={startPage === 1}
                >
                    이전
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        disabled={page === currentPage}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => goToPage(Math.min(endPage + 1, totalPages))}
                    disabled={endPage === totalPages}
                >
                    다음
                </button>
            </div>
        </>
    );
}

// Loader with searchParams
export async function loader({ request, type }) {
    const url = new URL(request.url);
    const contenttypeid = type || '12';
    const region = url.searchParams.get('region') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const searchText = url.searchParams.get('searchText') || '';

    const query = new URLSearchParams({
        contenttypeid,
        page,
        ...(searchText && { searchText }),
        ...(region && { region }),
    }).toString();

    try {
        const tourInfoList = await axios.get(`http://localhost:3500/tour/info?${query}`);
        const tourCodeList = await axios.get(`http://localhost:3500/tour/code`);

        return {
            tourInfoList: tourInfoList.data.data.items,
            totalCount: tourInfoList.data.data.totalCount,
            tourCodeList: tourCodeList.data.data,
        };
    } catch (error) {
        console.error('Failed to fetch data from API:', error);
        throw new Error('Failed to load data.');
    }
}