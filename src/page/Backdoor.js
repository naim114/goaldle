import React from 'react';
import { Button, Grid, TextField } from '@mui/material';
import Dashboard from './Dashboard';
import ManageSettings from './ManageSettings';
import ManageCountry from './ManageCountry';
import ManageLeague from './ManageLeague';

function Backdoor(props) {
    const [val, setVal] = React.useState('');
    const [enter, setEnter] = React.useState(false);
    const [drawer, setDrawer] = React.useState('dashboard');

    const handleChange = (e) => {
        setVal(e.target.value);
        if (e.target.value === `A`) {
            // if (e.target.value === `desdemonaOTHELLO${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}ALPHAomega`) {
            console.log("You really should'nt be here :)");
            setEnter(true);
        }
    }

    const active = {
        width: '100%',
        marginBottom: '1px',
        color: 'white',
        backgroundColor: '#5cdb94',
    }

    const notActive = {
        width: '100%',
        marginBottom: '1px',
        color: 'white',
        backgroundColor: '#0a1929',
    }

    return (
        <div>
            {
                enter
                    ?
                    <Grid container spacing={2} style={{ height: '100%', padding: '30px', marginBottom: '30px' }}>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                style={drawer === 'dashboard' ? active : notActive}
                                onClick={() => setDrawer('dashboard')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="contained"
                                style={drawer === 'settings' ? active : notActive}
                                onClick={() => setDrawer('settings')}
                            >
                                Settings
                            </Button>
                            <Button
                                variant="contained"
                                style={drawer === 'country' ? active : notActive}
                                onClick={() => setDrawer('country')}
                            >
                                Country
                            </Button>
                            <Button
                                variant="contained"
                                style={drawer === 'league' ? active : notActive}
                                onClick={() => setDrawer('league')}
                            >
                                League
                            </Button>
                            <Button
                                variant="contained"
                                style={drawer === 'player' ? active : notActive}
                                onClick={() => setDrawer('player')}
                            >
                                Player
                            </Button>
                            <Button
                                variant="contained"
                                style={drawer === 'team' ? active : notActive}
                                onClick={() => setDrawer('team')}
                            >
                                Team
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                style={{ width: '100%' }}
                                onClick={props.goBackHome}
                            >
                                Back to home
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            {(() => {
                                if (drawer === 'dashboard') {
                                    return (
                                        <Dashboard />
                                    )
                                } else if (drawer === 'settings') {
                                    return (
                                        <ManageSettings
                                            onRefresh={() => setDrawer('dashboard')}
                                        />
                                    )
                                } else if (drawer === 'country') {
                                    return (
                                        <ManageCountry
                                            onRefresh={() => setDrawer('dashboard')}
                                        />
                                    )
                                } else if (drawer === 'league') {
                                    return (
                                        <ManageLeague
                                            onRefresh={() => setDrawer('dashboard')}
                                        />
                                    )
                                }
                            })()}
                        </Grid>
                    </Grid>
                    :
                    <Grid container direction={"column"} style={{ height: '100%', padding: '100px', marginBottom: '30px', marginTop: '30px' }} >
                        <TextField style={{ marginBottom: "10px" }} onChange={handleChange} value={val} label="Enter Email" variant="filled" />
                        <TextField style={{ marginBottom: "30px" }} label="Enter Passowrd" variant="filled" />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginBottom: "10px" }}
                            onClick={props.goBackHome}
                        >
                            LOGIN
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={props.goBackHome}
                        >
                            BACK TO HOME
                        </Button>
                    </Grid>
            }
        </div>
    );
}

export default Backdoor;