import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    Pagination,
    Button,
    Box,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { useLoaderData, useNavigate, useSearchParams, useLocation } from 'react-router-dom';

export default function TourInfoList() {
    const { tourCodeList, tourInfoList, totalCount } = useLoaderData();
    const { sigungu } = tourCodeList;
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState('');
    const [selectedRegions, setSelectedRegions] = useState([]);

    const ITEMS_PER_PAGE = 20;
    const MAX_PAGE_DISPLAY = 10;
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    useEffect(() => {
        setSelectedRegions([]);
        setSearchText('');
        setSearchParams(new URLSearchParams({ page: '1' }));
    }, [location.pathname]);

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
        params.set('page', '1');
        setSearchParams(params, { replace: true });
    };

    const handleSearchChange = (e) => setSearchText(e.target.value);

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);
        if (searchText) {
            params.set('searchText', searchText);
        } else {
            params.delete('searchText');
        }
        params.set('page', '1');
        setSearchParams(params, { replace: true });
    };

    const goToPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        setSearchParams(params, { replace: true });
    };

    const handleItemClick = (contentid) => {
        navigate(`/tour/${contentid}`);
    };

    const startPage = Math.floor((currentPage - 1) / MAX_PAGE_DISPLAY) * MAX_PAGE_DISPLAY + 1;
    const endPage = Math.min(startPage + MAX_PAGE_DISPLAY - 1, totalPages);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="contents_wrap">
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <h3 className="tit_h3 mt40">추천 여행지</h3>
                    </Grid>
                    <Grid item xs={8}>
                        <div className="list_wrap">
                            <form onSubmit={handleSearchSubmit}>
                                <Box display="flex" gap={2} alignItems="center">
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="검색어를 입력하세요"
                                        value={searchText}
                                        onChange={handleSearchChange}
                                        size="small"
                                    />
                                    <Button type="submit" variant="contained" color="primary">
                                        검색
                                    </Button>
                                </Box>
                            </form>

                            <FormGroup row sx={{ gap: '10px', mt: 2 }}>
                                {sigungu.map((region) => (
                                    <FormControlLabel
                                        key={region.code}
                                        control={
                                            <Checkbox
                                                checked={selectedRegions.includes(region.code)}
                                                onChange={() => toggleRegionSelection(region.code)}
                                            />
                                        }
                                        label={region.name}
                                    />
                                ))}
                            </FormGroup>

                            <List>
                                {tourInfoList.map((info) => (
                                    <ListItem
                                        key={info._id}
                                        button
                                        onClick={() => handleItemClick(info.contentid)}
                                    >
                                        {info.firstimage2 && (
                                            <Box
                                                component="img"
                                                src={info.firstimage2}
                                                alt={info.title}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: 'cover',
                                                    borderRadius: 4,
                                                    marginRight: 2,
                                                }}
                                            />
                                        )}
                                        <ListItemText
                                            primary={<Typography variant="h6">{info.title}</Typography>}
                                            secondary={
                                                <Typography variant="body2" color="textSecondary" noWrap>
                                                    {info.description || '설명이 없습니다.'}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(event, page) => goToPage(page)}
                                variant="outlined"
                                color="primary"
                                sx={{ mt: 2 }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}


// Loader with searchParams
export async function loader({request, type}) {
    const url = new URL(request.url);
    const contenttypeid = type || '12';
    const region = url.searchParams.get('region') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const searchText = url.searchParams.get('searchText') || '';

    const query = new URLSearchParams({
        contenttypeid,
        page,
        ...(searchText && {searchText}),
        ...(region && {region}),
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
