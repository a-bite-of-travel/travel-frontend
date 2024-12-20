import { Stack, Container, Button, Grid, Avatar, Typography, Link, Menu, MenuItem } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useState } from 'react'

export default function Header() {
    // 로그인 상태 및 사용자 정보 가져오기
    const { isLoggedIn, user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const profileImage = user?.profileImage ? user.profileImage.replace(/^public[\\/]/, "/").replace(/\\/g, "/") : null;

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
            <header>
                <Container maxWidth="lg">
                    <Grid container>
                        <Grid item xs sx={{ display: 'flex', alignItems: 'center' }}>
                            <h1><Link component={RouterLink} to="/"><img src="/images/h1_ssoulRoad.png" alt="Ssoul Road" /></Link></h1>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }} className="nav">
                            <Stack spacing={10} direction="row">
                                <Link color="inherit" underline="none" sx={{ '&:hover': { color: 'primary.main' } }} component={RouterLink} to="/plan"><b>여행계획</b></Link>
                                <Link
                                    color="inherit"
                                    underline="none"
                                    sx={{ '&:hover': { color: 'primary.main' }, cursor: 'pointer' }}
                                    onClick={handleMenuClick}
                                >
                                    <b>여행정보</b>
                                </Link>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    disableAutoFocusItem
                                    disableRestoreFocus
                                    sx={{top:'10px'}}
                                >
                                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/tour">
                                        여행지
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/food">
                                        음식점
                                    </MenuItem>
                                </Menu>
                                <Link
                                    color="inherit"
                                    underline="none"
                                    sx={{ '&:hover': { color: 'primary.main' }, cursor: 'pointer' }}
                                    component={RouterLink} to="/review"
                                >
                                    <b>리뷰</b>
                                </Link>
                                {/* <Link component={RouterLink} to="/guide" color="inherit" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}><b>Guide</b></Link> */}
                            </Stack>
                        </Grid>
                        
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        {isLoggedIn ? (
                            // 로그인된 경우  
                            <Stack direction="row" sx={{ alignItems: 'center' }} justifyContent="flex-end">
                                <Link color="inherit" underline="none" to={`/${user?.id}`} component={RouterLink} sx={{ '&:hover': { color: 'primary.main' }, display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        src={profileImage ? `${process.env.REACT_APP_BASE_URL}${profileImage}` : "/images/profile_default.png"}
                                        alt={user?.email || "닉네임"}
                                    />
                                    <Typography variant="body1" sx={{ marginLeft: '10px' }}>
                                        {user?.nickName || "닉네임"}
                                    </Typography>
                                </Link>
                                <Button variant="text" size="small" sx={{ borderRadius: '20px', marginLeft: '20px !important' }} onClick={logout}>Sign out</Button>
                            </Stack>
                        ) : (
                            // 로그인되지 않은 경우
                            <Stack spacing={1} direction="row" justifyContent="flex-end">
                                <Link component={RouterLink} to="/auth/Login"><Button variant="text" sx={{ borderRadius: '20px' }} size="small">Login</Button></Link>
                                <Link component={RouterLink} to="/users/Signup"><Button variant="contained" sx={{ borderRadius: '20px' }} size="small">Sign up</Button></Link>
                            </Stack>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </header>
    );
}