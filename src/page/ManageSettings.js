import { Card, CardContent, Typography, ListItemButton, Button, ListItemText, Box, Modal, LinearProgress, CircularProgress } from '@mui/material';
import React from 'react';
import GoaldleAutocomplete from '../components/GoaldleAutocomplete';
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from '../utils/firebase';
import { Player } from '../utils/model/player';
import { fetchTeam, fetchCountry } from '../utils/controller';

function ManageSettings(props) {
    const [playerX, setPlayerX] = React.useState(null);

    const getPlayerX = async () => {
        // get playerX id on settings
        let playerX = '';

        const docRefRandom = doc(db, "Settings", "settings_mystery_player");
        const docSnapRandom = await getDoc(docRefRandom);

        if (docSnapRandom.exists()) {
            playerX = docSnapRandom.data().id;
        } else {
            // doc.data() will be undefined in this case
            console.log("Player not found");
            return false;
        }

        // init playerX model
        const docRef = doc(db, "Player", playerX);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = new Player(
                docSnap.id,
                docSnap.data().age,
                await fetchCountry(docSnap.data().country),
                docSnap.data().name,
                docSnap.data().number,
                docSnap.data().position,
                docSnap.data().showCount,
                await fetchTeam(docSnap.data().team),
            );
            // console.log(data);
            setPlayerX(data);
            return data;
        } else {
            // doc.data() will be undefined in this case
            console.log("Player not found");
            return false;
        }
    }

    React.useEffect(() => {
        getPlayerX();
    }, []);

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

    const [val, setVal] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleRefresh = () => {
        props.onRefresh();
    }

    const updatePlayerX = async () => {
        if (val === null) {
            console.log("No player selected");
        } else {
            console.log(val.id);
            setLoading(true);

            const docRef = doc(db, "Settings", "settings_mystery_player");
            try {
                const newPlayerX = await runTransaction(db, async (transaction) => {
                    const targetDoc = await transaction.get(docRef);
                    if (!targetDoc.exists()) {
                        throw "Document does not exist!";
                    }
                    transaction.update(docRef, { id: val.id });
                });
                console.log("Player X updated to " + val.name);
                handleClose();
                handleRefresh();
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        }
    }

    return (
        playerX === null || loading === true
            ? <LinearProgress />
            : <div>
                <Card sx={{ backgroundColor: '#0a1929', color: 'white', padding: '10px' }}>
                    <CardContent>
                        <Typography variant="h4" component="div" style={{ marginBottom: '15px' }}>
                            Manage Settings
                        </Typography>
                        <ListItemButton onClick={handleOpen}>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" component="div">
                                        {"Player X (Mystery Player)"}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="p" component="div" style={{ color: '#939ca6' }}>
                                        {playerX.name ?? 'None'}
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
                            Set Player X
                        </Typography>
                        <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                            Choose a player and press CONFIRM to set Player X. <br /> <b>NOTE: There is automatic function that set new player daily. Only change it when needed.</b>
                        </Typography>
                        <GoaldleAutocomplete
                            onChange={(player) => { setVal(player) }}
                            inputColor="black"
                        />
                        {(() => {
                            if (loading) {
                                return (
                                    <CircularProgress />
                                )
                            } else {
                                return (
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        onClick={updatePlayerX}
                                        disable={loading}
                                    >
                                        Confirm
                                    </Button>
                                )
                            }
                        })()}
                    </Box>
                </Modal>
            </div>
    );
}

export default ManageSettings;