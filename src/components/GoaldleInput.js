import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function GoaldleInput(props) {
    const playerList = props.playerList;

    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);

        props.onChange(event.target.value);
    };

    return (
        <Box style={{ marginBottom: '20px' }}>
            <FormControl
                fullWidth
                focused
            >
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    value={value}
                    label={props.label}
                    onChange={handleChange}
                    style={{
                        color: 'white',
                    }}
                >
                    {playerList.map((player) => (
                        <MenuItem key={player.id} value={player.id}>{player.data.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}