
import * as React from 'react';
import { 
    Stack, 
    Container, 
    Button, 
    FormControl, 
    FormControlLabel, 
    FormLabel, Select, 
    TextField, 
    Radio, 
    RadioGroup, 
    MenuItem, 
    FormHelperText, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions ,
    Box,
} from '@mui/material';

export default function Guide() {
    /* select */
    const [age, setAge] = React.useState('10');

    const handleChange = (event) => {
        setAge(event.target.value);
    };


    /* layer*/
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Container id="container">
            <Box sx={{ width: 500, maxWidth: '100%' }}>




                <h2>form</h2><br />
                {/* input */}
                <FormControl fullWidth>
                    <Stack spacing={1}>
                        <TextField
                            id=""
                            label="Email"
                        />
                        <TextField
                            id=""
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                        />
                        {/* error */}
                        <TextField
                            id=""
                            error
                            helperText="Incorrect entry."
                        />
                    </Stack>
                </FormControl>


                {/* radio */}<br /><br /><br />
                <Stack spacing={1}>
                    <FormControl fullWidth>
                        <FormLabel id="">여행기간</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio />} label="하루" />
                            <FormControlLabel value="male" control={<Radio />} label="1박 2일" />
                            <FormControlLabel value="other" control={<Radio />} label="2박 3일" />
                        </RadioGroup>
                    </FormControl>

                    {/* error */}
                    <FormControl fullWidth error>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio />} label="하루" />
                            <FormControlLabel value="male" control={<Radio />} label="1박 2일" />
                            <FormControlLabel value="other" control={<Radio />} label="2박 3일" />
                        </RadioGroup>
                        <FormHelperText>Error</FormHelperText>
                    </FormControl>
                </Stack>


                {/* Select */}<br /><br />
                <FormControl fullWidth>
                    <FormLabel id="demo-simple-select-label">지역선택</FormLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        onChange={handleChange}
                        sx={{ mt: 1 }}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth error>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        onChange={handleChange}
                        sx={{ mt: 1 }}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText>Error</FormHelperText>
                </FormControl>

                {/* textarea */}<br /><br /><br />
                <FormControl fullWidth>
                    <FormLabel id="demo-simple-select-label">내용</FormLabel>
                    <TextField
                        id="outlined-multiline-static"
                        label=""
                        multiline
                        rows={4}
                        defaultValue="내용입력"
                        sx={{ mt: 1 }}
                    />
                </FormControl>





                <h2 style={{ marginTop: '50px' }}>button</h2><br />
                <Stack spacing={2}>
                    <div>
                        <Button variant="contained" size="small" sx={{ borderRadius: '20px', }} >Sign up</Button>
                    </div>

                    <div>
                        <Button variant="contained" size="large" fullWidth>Login</Button>
                    </div>

                    <Stack direction="row" justifyContent="center">
                        <Button variant="contained" size="midium" >저장</Button>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end">
                        <Button variant="text" size="small" sx={{ color: 'secondary.main' }} >Sign up</Button>
                    </Stack>

                    <Stack direction="row">
                        <FormControl fullWidth>
                            <TextField
                                id="outlined-multiline-static"
                                label=""
                                multiline
                                rows={2}
                                defaultValue="내용입력"
                            />
                        </FormControl>
                        <Button variant="contained" size="small" sx={{ ml: 1 }}  >저장</Button>
                    </Stack>
                </Stack>




                <h2 style={{ marginTop: '50px' }}>layer</h2><br />
                <React.Fragment>
                    <Button variant="outlined" onClick={handleClickOpen}>
                        여행계획
                    </Button>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            component: 'form',
                            onSubmit: (event) => {
                                event.preventDefault();
                                handleClose();
                            },
                        }}
                        className="customLayer01"
                    >
                        <DialogTitle>
                            <Stack direction="row">
                                여행계획
                                <Button onClick={handleClose}>X</Button>
                            </Stack>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            </DialogContentText>

                            <Box sx={{ width: 400, maxWidth: '100%' }}>
                                <FormControl fullWidth>
                                    <FormLabel id="demo-simple-select-label">지역선택</FormLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={age}
                                        onChange={handleChange}
                                        sx={{ mt: 1 }}
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                justifyContent: 'center', // 버튼을 수평으로 가운데 정렬
                            }}>
                            <Button variant="contained" size="large" type="submit">일정확인하기</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>




            </Box>
        </Container>
    );
}