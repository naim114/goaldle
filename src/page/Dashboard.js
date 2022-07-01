import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
function Dashboard(props) {

    return (
        <div>
            <Card sx={{ backgroundColor: '#0a1929', color: 'white', padding: '10px' }}>
                <CardContent>
                    <Typography variant="h4" component="div" style={{ marginBottom: '15px' }}>
                        Dashboard
                    </Typography>
                    <p>Welcome to Goaldle admin console.</p>
                    <ul>
                        <li>Player X were set daily by server. So set Player X when really need to.</li>
                        <li>When deleting a data, please check if there is any relation to another data. For example When deleting a country please check there is no league or player is set to that country</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

export default Dashboard;