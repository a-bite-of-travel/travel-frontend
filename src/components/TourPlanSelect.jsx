import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
} from '@mui/material';
import * as React from 'react';
import { Form, useActionData } from 'react-router-dom';

export default function TourPlanSelect({ catCode, periodCode, sigunguCode }) {
    const actionData = useActionData(); // action 함수의 반환 데이터를 읽음
    const [sigungu, setSigungu] = React.useState('');
    const [theme, setTheme] = React.useState('');
    const [period, setPeriod] = React.useState('');

    const handleSigunguChange = (event) => {
        setSigungu(event.target.value);
    };

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
    };

    return (
        <>
            <p>여행 일정 생성</p>
            <Form method="post">
                {/* 지역 선택 */}
                <FormControl fullWidth>
                    <FormLabel id="sigungu-label">지역 선택</FormLabel>
                    <Select
                        labelId="sigungu-label"
                        id="sigungu-select"
                        value={sigungu}
                        onChange={handleSigunguChange}
                        name="sigunguCode"
                        sx={{ mt: 1 }}
                    >
                        {sigunguCode.map((sigungu) => (
                            <MenuItem key={sigungu.code} value={JSON.stringify(sigungu)}>
                                {sigungu.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 테마 선택 */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <FormLabel id="theme-label">테마 선택</FormLabel>
                    <Select
                        labelId="theme-label"
                        id="theme-select"
                        value={theme}
                        onChange={handleThemeChange}
                        name="theme"
                        sx={{ mt: 1 }}
                    >
                        {catCode.map((theme) => (
                            <MenuItem key={theme.code} value={JSON.stringify(theme)}>
                                {theme.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 여행 기간 선택 */}
                <FormControl fullWidth sx={{ mt: 2 }}>
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
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <Button variant="contained" size="medium" type="submit">
                        일정 생성
                    </Button>
                </Stack>
            </Form>
        </>
    );
}
