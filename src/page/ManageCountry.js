import { Card, CardContent, Typography, ListItemButton, Button, ListItemText, Box, Modal, LinearProgress } from '@mui/material';
import React from 'react';
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from '../utils/firebase';
import { Player } from '../utils/model/player';
import { fetchTeam, fetchCountry } from '../utils/controller';

function ManageCountry() {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Card sx={{ backgroundColor: '#0a1929', color: 'white', padding: '10px' }}>
                <CardContent>
                    <Typography variant="h4" component="div" style={{ marginBottom: '15px' }}>
                        Manage Country
                    </Typography>
                    <ListItemButton onClick={handleOpen}>
                        <ListItemText
                            primary={
                                <Typography variant="h6" component="div">
                                    Manage Settings
                                </Typography>
                            }
                            secondary={
                                <Typography variant="p" component="div" style={{ color: '#939ca6' }}>
                                    None
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </CardContent>
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Set Mystery Player
                    </Typography>
                    <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                        Choose a player and press CONFIRM to set Player X. <br /> <b>NOTE: There is automatic function that set new player daily. Only change it when needed.</b>
                    </Typography>
                    <Button
                        color="secondary"
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default ManageCountry;