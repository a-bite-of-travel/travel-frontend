import React, { useEffect } from "react";
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Grid,
    Link,
    Avatar,
    Typography
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import SubTitle from "../components/SubTitle";

export default function Mypage() {
    const { user } = useAuth();
    return (
        <div className="contents_wrap">
            <SubTitle type="ty5" />
            <Container maxWidth={false} id="container" className="mypage" sx={{ backgroundColor: '#f0f0f0' }}>
                <Container maxWidth="lg">
                    <Grid container alignItems="center" spacing={4} className="top">
                        <Grid item>
                            <Avatar
                                src={user?.profileImage ? `http://localhost:3500${user.profileImage}` : "/images/profile_default.png"}
                                alt={user?.nickName}
                                sx={{ width: 100, height: 100 }}
                            />
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body1">
                                <b>Nickname : </b> {user?.nickName}
                            </Typography>
                            <Typography variant="body1">
                                <b>E-Mail : </b> {user?.email}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </div>
    );
}