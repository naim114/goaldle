import * as React from 'react';
import { Container, Grid, Typography } from '@mui/material';

function GoaldleLogo() {
    return (
        <Container style={{ textAlign: 'center', marginBottom: "40px", marginTop: "40px" }}>
            <Typography
                variant="h2"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{
                    fontWeight: 'bolder',
                    color: 'white',
                }}
            >
                GOALDLE
            </Typography>
            <Typography
                variant="h5"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{
                    color: '#5cdb94',
                }}
            >
                Football Player Guessing Game
            </Typography>
        </Container>
    );
}

export default GoaldleLogo;