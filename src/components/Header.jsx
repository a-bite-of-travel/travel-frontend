import { Stack, Container, Button, Grid, Avatar, Typography, Link, Menu, MenuItem } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useState } from 'react'

export default function Header() {
    // 로그인 상태 및 사용자 정보 가져오기
    const { isLoggedIn, user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);
    const [anchorE3, setAnchorE3] = useState(null);
    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorE2);
    const open3 = Boolean(anchorE3);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    console.log('header',user)

    const profileImage = user?.profileImage ? user.profileImage.replace(/^public[\\/]/, "/").replace(/\\/g, "/") : null;
    //console.log('profileImage>>>>>>>>>>>>>>>>>',profileImage)

    const handleMenuClick2 = (event) => {
        setAnchorE2(event.currentTarget);
    };

    const handleMenuClick3 = (event) => {
        setAnchorE3(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuClose2 = () => {
        setAnchorE2(null);
    };
    const handleMenuClose3 = () => {
        setAnchorE3(null);
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
                                <Link onClick={handleMenuClick3} color="inherit" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}><b>여행계획</b></Link>
                                <Menu
                                    anchorEl={anchorE3}
                                    open={open3}
                                    onClose={handleMenuClose3}
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
                                    <MenuItem onClick={handleMenuClose3} component={RouterLink} to="/plan">
                                        여행계획 하기
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose3} component={RouterLink} to="/">
                                        여행계획 결과
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose3} component={RouterLink} to="/">
                                        나의 여행
                                    </MenuItem>
                                </Menu>
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
                                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/festival">
                                        축제
                                    </MenuItem>
                                </Menu>
                                <Link
                                    color="inherit"
                                    underline="none"
                                    sx={{ '&:hover': { color: 'primary.main' }, cursor: 'pointer' }}
                                    onClick={handleMenuClick2}
                                >
                                    <b>리뷰</b>
                                </Link>
                                <Menu
                                    anchorEl={anchorE2}
                                    open={open2}
                                    onClose={handleMenuClose2}
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
                                    <MenuItem onClick={handleMenuClose2} component={RouterLink} to="/tourinfo">
                                        리뷰 목록
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose2} component={RouterLink} to="/review">
                                        리뷰 작성
                                    </MenuItem>
                                </Menu>
                                {/* <Link component={RouterLink} to="/guide" color="inherit" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}><b>Guide</b></Link> */}
                            </Stack>
                        </Grid>
                        
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        {isLoggedIn ? (
                            // 로그인된 경우  
                            <Stack direction="row" sx={{ alignItems: 'center' }} justifyContent="flex-end">
                                <Link color="inherit" underline="none" to={`/${user?.id}`} component={RouterLink} sx={{ '&:hover': { color: 'primary.main' }, display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        src={profileImage ? `http://localhost:3500${profileImage}` : "/images/profile_default.png"} 
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