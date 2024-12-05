import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    FormGroup,
    Checkbox,
    Stack,
    Grid,
    Typography,
    Box,
    Select,
    MenuItem,
    RadioGroup,
    Radio,
    TextField
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as React from 'react';

export default function TourPlanSelect({ catCode, periodCode, sigunguCode }) {
    const [sigungu, setSigungu] = React.useState('');
    const [theme, setTheme] = React.useState([]); // 다중 선택된 테마 배열
    const [period, setPeriod] = React.useState('');
    const [startDate, setStartDate] = React.useState(null); // 선택된 날짜

    const handleSigunguChange = (event) => {
        setSigungu(event.target.value);
    };

    const handleThemeChange = (event, themeItem) => {
        setTheme((prev) =>
            prev.some((item) => item.code === themeItem.code)
                ? prev.filter((item) => item.code !== themeItem.code) // 선택 해제
                : [...prev, { code: themeItem.code, name: themeItem.name }] // 선택 추가
        );
    };

    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
    };

    // 전달할 데이터 형식으로 변환된 theme 배열
    const formattedTheme = theme.map((item) => ({
        code: item.code,
        name: item.name,
    }));

    return (
        <>
            <div className='tit_box'>여행일정 만들기</div>

            {/* 지역 선택 */}
            <FormControl fullWidth className='plan_box'>
                <FormLabel id="sigungu-label">지역 선택</FormLabel>
                <Select
                    labelId="sigungu-label"
                    id="sigungu-select"
                    value={sigungu}
                    onChange={handleSigunguChange}
                    name="sigunguCode"
                >
                    {sigunguCode.map((sigungu) => (
                        <MenuItem key={sigungu.code} value={JSON.stringify(sigungu)}>
                            {sigungu.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* 테마 선택 */}
            <FormControl fullWidth sx={{ mt: 2 }} className="plan_box">
                <FormLabel id="theme-label">테마 선택</FormLabel>
                <FormGroup>
                    <Grid container spacing={1}>
                        {catCode.map((themeItem) => (
                            <Grid item xs={3} key={themeItem.code}>
                                <Box
                                    sx={{
                                        border: '1px solid #ccc',
                                        borderRadius: 2,
                                        padding: 1,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: theme.some((item) => item.code === themeItem.code)
                                            ? '#e0f7fa'
                                            : '#fff',
                                    }}
                                    onClick={(event) => handleThemeChange(event, themeItem)}
                                >
                                    <Typography>{themeItem.name}</Typography>
                                    <Checkbox
                                        checked={theme.some((item) => item.code === themeItem.code)}
                                        value={themeItem.code}
                                        sx={{ display: 'none' }}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </FormGroup>
            </FormControl>

            {/* 날짜 선택 */}
            <FormControl fullWidth sx={{ mt: 2 }} className="plan_box">
                <FormLabel>여행 시작 날짜</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="YYYY-MM-DD"
                    />
                </LocalizationProvider>
            </FormControl>

            {/* 숨겨진 필드로 선택한 값 전달 */}
            <input
                type="hidden"
                name="theme"
                value={JSON.stringify(formattedTheme)} // 변환된 theme 데이터를 직렬화하여 전송
            />
            <input
                type="hidden"
                name="startDate"
                value={startDate ? startDate.format('YYYY-MM-DD') : ''} // 날짜를 포맷팅하여 전송
            />

            {/* 여행 기간 선택 */}
            <FormControl fullWidth sx={{ mt: 2 }} className='plan_box'>
                <FormLabel>여행 기간</FormLabel>
                <RadioGroup
                    row
                    name="period"
                    value={period}
                    onChange={handlePeriodChange}
                >
                    {periodCode.map((period) => (
                        <FormControlLabel
                            key={period.code}
                            value={period.name}
                            control={<Radio />}
                            label={period.name}
                        />
                    ))}
                </RadioGroup>
            </FormControl>

            {/* 제출 버튼 */}
            <Stack direction="row" justifyContent="center">
                <Button variant="contained" size="large" type="submit" fullWidth sx={{mt:3}}>
                    일정 생성
                </Button>
            </Stack>
        </>
    );
}
