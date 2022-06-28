import { TableRow, TableCell } from '@mui/material';
import React from 'react';

function GoaldleTableRow(props) {
    const player = props.player;
    const playerX = props.playerX;

    const defaultStyle = {
        textAlign: 'center',
        color: 'black',
        backgroundColor: '#edeae5',
    };

    const successStyle = {
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#37be75',
    };

    const warningStyle = {
        textAlign: 'center',
        color: 'black',
        backgroundColor: '#f4e878',
    };

    const check = (playerVal, playerXVal) => {
        if (playerVal === playerXVal) {
            return successStyle;
        }
        else {
            return defaultStyle;
        }
    }

    const checkTeam = () => {
        if (player.team.id === playerX.team.id) {
            return successStyle;
        }
        else if (player.team.league.id === playerX.team.league.id) {
            return warningStyle;
        }
        else {
            return defaultStyle;
        }
    }

    const checkCountry = () => {
        if (player.country.id === playerX.country.id) {
            return successStyle;
        }
        else if (player.country.continent === playerX.country.continent) {
            return warningStyle;
        }
        else {
            return defaultStyle;
        }
    }

    const [ageStyle, setAgeStyle] = React.useState(defaultStyle);
    const [age, setAge] = React.useState('');

    const [numberStyle, setNumberStyle] = React.useState(defaultStyle);
    const [number, setNumber] = React.useState('');

    React.useEffect(() => {
        // check age
        if (((playerX.age - player.age) <= 2 && (playerX.age - player.age) > 0) || ((player.age - playerX.age) <= 2 && (player.age - playerX.age) > 0)) {
            setAgeStyle(warningStyle);
        }

        if (playerX.age < player.age) {
            setAge(`${player.age}  ↓`);
        } else if (playerX.age > player.age) {
            setAge(`${player.age}  ↑`);
        } else if (player.age === playerX.age) {
            setAgeStyle(successStyle);
            setAge(`${player.age}`);
        } else {
            setAge('None');
        }

        if (((playerX.number - player.number) <= 2 && (playerX.number - player.number) > 0) || ((player.number - playerX.number) <= 2 && (player.number - playerX.number) > 0)) {
            setNumberStyle(warningStyle);
        }
        // check number
        if (player.number > playerX.number) {
            setNumber(`${player.number}  ↑`);
        } else if (player.number < playerX.number) {
            setNumber(`${player.number}  ↓`);
        } else if (player.number === playerX.number) {
            setNumberStyle(successStyle);
            setNumber(`${player.number}`);
        } else {
            setNumber('None');
        }

    }, [])

    return (
        <TableRow
            key={props.index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            {/* Name */}
            <TableCell
                style={check(player.name, playerX.name)}
                component="th"
                scope="row"
            >
                {player.name ?? "None"}
            </TableCell>
            {/* Team */}
            <TableCell
                style={checkTeam()}
                component="th"
                scope="row"
            >
                {player.team.name ?? "None"}
            </TableCell>
            {/* Position */}
            <TableCell
                style={check(player.position, playerX.position)}
                component="th"
                scope="row"
            >
                {player.position ?? "None"}
            </TableCell>
            {/* Country */}
            <TableCell
                style={checkCountry()}
                align="right"
            >
                {player.country.name ?? "None"}
            </TableCell>
            {/* Age */}
            <TableCell
                style={ageStyle}
                align="right"
            >
                {age}
            </TableCell >
            {/* Number */}
            <TableCell
                style={numberStyle}
                align="right"
            >
                {number}
            </TableCell >
        </TableRow >
    );
}

export default GoaldleTableRow;