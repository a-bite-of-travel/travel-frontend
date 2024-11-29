import React, { useState } from 'react';
import {
    Stack,
    Button,
    FormControl,
    TextField,
    Grid,
    Box
} from '@mui/material';
import axios from 'axios';
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext"; // Context 사용
import { useAuth } from "../context/AuthContext";



export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const { triggerRefresh } = useAppContext();
    const { loginedCheck } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!email) {
            errors.email = "이메일을 입력해주세요.";
        }
        if (!password) {
            errors.password = "비밀번호를 입력해주세요.";
        }

        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }

        // 서버로 로그인 요청 보내기
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password,
            });
            console.log('로그인 성공:', response.data);
            const user = response.data.user

            // 로그인 성공 후 토큰 저장 및 페이지 이동
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            await loginedCheck(user)
            //triggerRefresh();
            // navigate('/');
        } catch (err) {
            console.error('로그인 실패:', err.response ? err.response.data : err.message);
            setError({ general: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
    };

    return (
        <Grid container id="container" className="bg-login" alignItems="center" justifyContent="center">
            <Grid item>
                <Box sx={{
                    backgroundColor: 'white',
                    width: 400,
                    maxWidth: '100%',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                }} component="form" onSubmit={handleSubmit}>
                    <FormControl fullWidth>
                        <Stack spacing={2}>
                            <div className="login-logo"><img src="../images/h1_ssoulRoad.png" alt="SsoulRoad" /></div>
                            <TextField
                                id="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!error.email}
                                helperText={error.email}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!error.password}
                                helperText={error.password}
                            />
                            {error.general && (
                                <div style={{ color: '#d32f2f', fontSize:'0.75rem',textAlign: 'center' }}>{error.general}</div>
                            )}
                            <div>
                                <Button variant="contained" size="large" fullWidth type="submit">Login</Button>
                            </div>
                        </Stack>
                    </FormControl>
                </Box>
            </Grid>
        </Grid >
    );
}