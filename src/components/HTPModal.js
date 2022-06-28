import { Box, Modal, Typography } from '@mui/material';

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
};

function HTPModal(props) {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2" style={{ textAlign: 'center' }}>
                    Guess who is Player X!
                </Typography>
                <ul>
                    <li style={{ marginBottom: '5px' }}>You get eight guesses, try any current football player!</li>
                    <li style={{ marginBottom: '5px' }}><span style={{ padding: '3px', backgroundColor: '#37be75', color: 'white' }}>Green in any column indicates a match!</span></li>
                    <li style={{ marginBottom: '5px' }}><span style={{ padding: '3px', backgroundColor: '#f4e878' }}>Yellow in the <b>Team</b> column indicates selected player's team is in the same league as Player X's team</span></li>
                    <li style={{ marginBottom: '5px' }}><span style={{ padding: '3px', backgroundColor: '#f4e878' }}>Yellow in the <b>Country</b> column indicates selected player's country is in the same continent as Player X's country</span></li>
                    <li style={{ marginBottom: '5px' }}><span style={{ padding: '3px', backgroundColor: '#f4e878' }}>Yellow in any other column indicates this attribute is within 2 (years, numbers) of the mystery player</span></li>
                    <li>A new Player X everyday! </li>
                </ul>
            </Box>
        </Modal>
    );
}

export default HTPModal;