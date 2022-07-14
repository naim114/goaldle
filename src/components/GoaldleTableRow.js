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
        if (((parseInt(playerX.age) - parseInt(player.age)) <= 2 && (parseInt(playerX.age) - parseInt(player.age)) > 0) || ((parseInt(player.age) - parseInt(playerX.age)) <= 2 && (parseInt(player.age) - parseInt(playerX.age)) > 0)) {
            setAgeStyle(warningStyle);
        }

        if (parseInt(playerX.age) < parseInt(player.age)) {
            setAge(`${parseInt(player.age)}  ↓`);
        } else if (parseInt(playerX.age) > parseInt(player.age)) {
            setAge(`${parseInt(player.age)}  ↑`);
        } else if (parseInt(player.age) === parseInt(playerX.age)) {
            setAgeStyle(successStyle);
            setAge(`${parseInt(player.age)}`);
        } else {
            setAge('None');
        }

        if (((parseInt(playerX.number) - parseInt(player.number)) <= 2 && (parseInt(playerX.number) - parseInt(player.number)) > 0) || ((parseInt(player.number) - parseInt(playerX.number)) <= 2 && (parseInt(player.number) - parseInt(playerX.number)) > 0)) {
            setNumberStyle(warningStyle);
        }
        // check number
        if (parseInt(player.number) > parseInt(playerX.number)) {
            console.log("Go Lower");
            console.log(`${parseInt(player.number)} > ${parseInt(playerX.number)}`);
            setNumber(`${parseInt(player.number)}  ↓`);
        } else if (parseInt(player.number) < parseInt(playerX.number)) {
            console.log("Go Higher");
            console.log(`${parseInt(player.number)} < ${parseInt(playerX.number)}`);
            setNumber(`${parseInt(player.number)}  ↑`);
        } else if (parseInt(player.number) === parseInt(playerX.number)) {
            setNumberStyle(successStyle);
            setNumber(`${parseInt(player.number)}`);
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