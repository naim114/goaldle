import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../index.css';

export default function ButtonAppBar(props) {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} style={{ fontWeight: 'bolder' }}>
                        GOALDLE
                    </Typography>
                    <Button color="inherit" onClick={props.onClickHTP}>How to play</Button>
                    <p className='secret'>.</p>
                    <p onClick={props.accessBackdoor} className='secret'>.</p>
                    <p className='secret'>.</p>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
