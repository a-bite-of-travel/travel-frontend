import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Stack,
    Button,
    FormControl,
    TextField,
    Grid,
    Box,
    InputAdornment,
} from '@mui/material';
import axiosInstance from "../utils/axiosInstance";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit", email, nickName,profileImage);
        await regist();
    };

    const regist = async () => {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirmPassword', confirmPassword);
            formData.append('nickName', nickName);

            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            const resp = await axiosInstance.post("/auth/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("회원가입 응답 데이터:", resp.data); // 디버깅용
            
            //상태 초기화
            // setEmail("");
            // setPassword("");
            // setConfirmPassword("");
            // setNickName("");
            // setProfileImage(null);
            // setError({});

            navigate("/auth/login");
        } catch (error) {
            console.error("회원가입 실패:", error.response ? error.response.data : error.message);
            if (error.response && error.response.data && error.response.data.errors) {
                console.log("에러 상세:", error.response.data.errors);  // 에러 응답 로그 추가
                const fieldErrors = error.response.data.errors.reduce((acc, curr) => {
                    // `param`을 우선 사용하고, `param`이 없으면 `path`를 사용
                    const fieldName = curr.param || curr.path;
                    acc[fieldName] = curr.msg;
                    return acc;
                }, {});
                setError(fieldErrors);
            } else {
                setError({ general: error.message });
            }
        }
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
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
                            <div className="login-logo"><img src="/images/h1_ssoulRoad.png" alt="Ssoul Road" /></div>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!error.email}
                                helperText={error.email}
                            />
                            <TextField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                type="password"
                                error={!!error.password}
                                helperText={error.password}
                            />
                            <TextField
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label="Confirm Password"
                                type="password"
                                error={!!error.confirmPassword}
                                helperText={error.confirmPassword}
                            />
                            <TextField
                                id=""
                                label="Nickname"
                                value={nickName}
                                onChange={(e) => setNickName(e.target.value)}
                                error={!!error.nickName}
                                helperText={error.nickName}
                            />
                            <TextField
                                label="Profile image"
                                value={profileImage ? profileImage.name : ''}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <input
                                                type="file"
                                                id="profileImage"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="profileImage">
                                                <Button variant="contained" component="span">
                                                    upload
                                                </Button>
                                            </label>
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                                sx={{ flex: 1 }}
                                error={!!error.profileImage}
                                helperText={error.profileImage}
                            />
                            {error.general && (
                                <div style={{ color: '#d32f2f', fontSize:'0.75rem',textAlign: 'center' }}>{error.general}</div>
                            )}
                            <div>
                                <Button variant="contained" size="large" fullWidth type="submit">Signup</Button>
                            </div>
                        </Stack>
                    </FormControl>
                </Box>
            </Grid>
        </Grid>
    );
}
