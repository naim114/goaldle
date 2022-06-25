import * as React from 'react';
import { AppBar, Link } from '@mui/material';

function Footer() {
    return (
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, backgroundColor: '#111111', color: 'white' }}>
            <Link href="https://github.com/naim114" style={{ padding: 10, textAlign: 'right', textDecoration: 'none', color: 'white' }}>
                Created by naim114
            </Link>
        </AppBar>
    );
}

export default Footer;