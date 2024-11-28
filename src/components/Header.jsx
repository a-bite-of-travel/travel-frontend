import { Stack, Container, Button, Grid, Avatar, Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item xs sx={{ display: 'flex', alignItems: 'center' }}>
                        <h1><Link component={RouterLink} to="/tour"><img src="/images/h1_ssoulRoad.png" alt="Ssoul Road" /></Link></h1>
                    </Grid>
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }} className="nav">
                        <Stack spacing={10} direction="row">
                            <Link component={RouterLink} to="/" color="inherit" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}><b>여행계획</b></Link>
                            <Link component={RouterLink} to="/" color="inherit" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}><b>여행정보</b></Link>
                            <Link component={RouterLink} to="/guide" color="inherit" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}><b>Guide</b></Link>
                        </Stack>
                    </Grid>
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        
                        {/* 로그인 전 */}
                        <Stack spacing={1} direction="row" justifyContent="flex-end">
                            <Link component={RouterLink} to="/auth/Login"><Button variant="text" size="small" sx={{ borderRadius: '20px' }}>Login</Button></Link>
                            <Link component={RouterLink} to="/auth/Signup"><Button variant="contained" sx={{ borderRadius: '20px' }} size="small">Sign up</Button></Link>
                        </Stack>
                        
                        {/* 로그인 후 */}
                        <Stack direction="row" sx={{ alignItems: 'center' }} justifyContent="flex-end">
                            <Link color="inherit" underline="none" to="/" component={RouterLink} sx={{ '&:hover': { color: 'primary.main' }, display: 'flex', alignItems: 'center' }}>
                                <Avatar alt="Default" src="/images/profile_default.png" />
                                <Typography variant="body1">{user?.user?.email || '사용자'}</Typography>
                            </Link>
                            <Button variant="text" size="small" sx={{ borderRadius: '20px', marginLeft: '20px !important' }} onClick={logout}>Sign out</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </header>
    );
}