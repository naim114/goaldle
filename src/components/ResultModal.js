import { Box, Modal, Typography, Divider, Button, CircularProgress } from '@mui/material';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import React from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

function ResultModal(props) {
    const playerX = props.playerX;
    const result = props.result;
    const guess = props.guess;

    const [pathOri, setPathOri] = React.useState(null);

    React.useEffect(() => {
        // set ori image
        const storage = getStorage();

        getDownloadURL(ref(storage, `player/${playerX.id}/ori.png`))
            .then((url) => {
                setPathOri(url);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])


    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            <Box sx={style}>
                {
                    playerX === null || pathOri === null
                        ?
                        <CircularProgress />
                        :
                        <img src={pathOri} alt={playerX.name} width={'150px'} style={{ marginBottom: '20px' }} />
                }
                <Divider style={{ width: '100%', marginBottom: '30px' }} sx={{ borderBottomWidth: 3, borderColor: 'black' }} />
                <Typography variant="h6" component="h6">
                    {result ? "Correct!" : "Sorry Player X is"}
                </Typography>
                <Typography variant="h4" component="h4" style={{ fontWeight: 'bold', fontSize: '29px' }}>
                    {playerX.name.toUpperCase()}
                </Typography>
                <Typography variant="h6" component="h6">
                    {result ? `You solved it in ${guess} guess` : "Better luck tomorrow!"}
                </Typography>
                <Button
                    style={{ marginTop: '10px' }}
                    variant="contained"
                    onClick={() => { navigator.clipboard.writeText(`Goaldle ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} - ${guess}/8 Guess\n${props.score}\n\nTry Now at https://goaldle.netlify.app/`) }}
                >
                    SHARE MY SCORE
                </Button>
                <Divider style={{ width: '100%', marginTop: '30px', marginBottom: '30px' }} sx={{ borderBottomWidth: 3, borderColor: 'black' }} />
            </Box>
        </Modal>
    );
}

export default ResultModal;