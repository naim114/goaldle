import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { collection, getDocs } from "firebase/firestore";
import { fetchPlayer } from '../utils/controller';
import { db } from '../utils/firebase';

export default function GoaldleInput(props) {
    const [playerList, setPlayerList] = React.useState([]);

    const getPlayers = async () => {
        let players = [];

        const querySnapshot = await getDocs(collection(db, "Player"));
        querySnapshot.forEach(async (doc) => {
            let player = await fetchPlayer(doc.id);
            players.push(player);
        });

        setPlayerList(players);
    }

    React.useEffect(() => {
        getPlayers();
    }, []);

    const handleChange = (event) => {
        // console.log(event.target.value);
        props.onChange(event.target.value);
    };

    return playerList.length === 0 ? null : (
        <Box style={{ marginBottom: '20px' }}>
            <FormControl
                fullWidth
                focused
            >
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    defaultValue={''}
                    label={props.label}
                    onChange={handleChange}
                    style={{
                        color: 'white',
                    }}
                >
                    {playerList.map((player) => (
                        <MenuItem key={player.id} value={player}>{player.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}