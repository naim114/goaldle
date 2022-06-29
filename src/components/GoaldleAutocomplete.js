import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { collection, getDocs } from "firebase/firestore";
import { fetchPlayer } from '../utils/controller';
import { db } from '../utils/firebase';

export default function GoaldleAutocomplete(props) {
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

    const handleChange = (event, values) => {
        if (values !== null) {
            // console.log(values);
            props.onChange(values);
        }
    };

    return playerList.length === 0 ? null : (
        <Autocomplete
            style={{ width: '100%', marginBottom: '20px' }}
            disablePortal
            options={playerList}
            sx={{ color: 'white' }}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label}
                    sx={{ input: { color: 'white' } }}
                />
            )}
        />
    );
}