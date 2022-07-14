import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { collection, getDocs, doc, getDoc, orderBy, query } from "firebase/firestore";
import { fetchPlayer } from '../utils/controller';
import { db } from '../utils/firebase';
import { CircularProgress } from '@mui/material';
import { fetchTeam, fetchCountry } from '../utils/controller';
import { Player } from '../utils/model/player';

export default function GoaldleAutocomplete(props) {
    const [playerList, setPlayerList] = React.useState([]);
    const getPlayers = async () => {
        let players = [];

        const querySnapshot = await getDocs(query(collection(db, "Player"), orderBy("name", "asc")));

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
            props.onChange(values);
        }
    };

    return playerList.length === 0
        ?
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ marginBottom: '10px' }}
        >
            <CircularProgress />
        </Grid>
        : (
            <Autocomplete
                style={{ width: '100%', marginBottom: '20px' }}
                disablePortal
                options={playerList}
                sx={{ color: props.inputColor === null ? 'white' : props.inputColor }}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={props.label ?? "Select a player"}
                        sx={{ input: { color: props.inputColor === null ? 'white' : props.inputColor } }}
                    />
                )}
            />
        );
}