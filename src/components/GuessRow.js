import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

function GuessRow(props) {
    const success = '#37be75';
    const warning = '#f4e878';

    // name
    let nameColor = 'black';
    let nameBg = '#edeae5';

    if (props.nameStatus === 'success') {
        nameColor = 'white';
        nameBg = success;
    } else if (props.nameStatus === 'warning') {
        nameColor = 'black';
        nameBg = warning;
    }

    // team
    let teamColor = 'black';
    let teamBg = '#edeae5';

    if (props.teamStatus === 'success') {
        teamColor = 'white';
        teamBg = success;
    } else if (props.teamStatus === 'warning') {
        teamColor = 'black';
        teamBg = warning;
    }

    // country
    let posColor = 'black';
    let posBg = '#edeae5';

    if (props.posStatus === 'success') {
        posColor = 'white';
        posBg = success;
    } else if (props.posStatus === 'warning') {
        posColor = 'black';
        posBg = warning;
    }

    // country
    let countryColor = 'black';
    let countryBg = '#edeae5';

    if (props.countryStatus === 'success') {
        countryColor = 'white';
        countryBg = success;
    } else if (props.countryStatus === 'warning') {
        countryColor = 'black';
        countryBg = warning;
    }

    // age
    let ageColor = 'black';
    let ageBg = '#edeae5';
    let ageArrow = '';

    if (props.ageStatus === 'success') {
        ageColor = 'white';
        ageBg = success;
        ageArrow = '';
    } else if (props.ageStatus === 'high') {
        ageColor = 'black';
        ageBg = warning;
        ageArrow = ' ↑';
    } else if (props.ageStatus === 'low') {
        ageColor = 'black';
        ageBg = warning;
        ageArrow = ' ↓';
    }

    // number
    let numColor = 'black';
    let numBg = '#edeae5';
    let numArrow = '';

    if (props.numStatus === 'success') {
        numColor = 'white';
        numBg = success;
        numArrow = '';
    } else if (props.numStatus === 'high') {
        numColor = 'black';
        numBg = warning;
        numArrow = ' ↑';
    } else if (props.numStatus === 'low') {
        numColor = 'black';
        numBg = warning;
        numArrow = ' ↓';
    }


    return (
        <TableRow
            key={props.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            {/* Name */}
            <TableCell
                style={{
                    textAlign: 'center',
                    color: nameColor,
                    backgroundColor: nameBg,
                }}
                component="th"
                scope="row"
            >
                {props.name ?? "None"}
            </TableCell>
            {/* Team */}
            <TableCell
                style={{
                    textAlign: 'center',
                    color: teamColor,
                    backgroundColor: teamBg,
                }}
                align="right"
            >
                {props.team ?? "None"}
            </TableCell>
            {/* Position */}
            <TableCell
                style={{
                    textAlign: 'center',
                    color: posColor,
                    backgroundColor: posBg,
                }}
                align="right"
            >
                {props.position ?? "None"}
            </TableCell>
            {/* country */}
            <TableCell
                style={{
                    textAlign: 'center',
                    color: countryColor,
                    backgroundColor: countryBg,
                }}
                align="right"
            >
                {props.country ?? "None"}
            </TableCell>
            {/* Age */}
            <TableCell
                style={{
                    textAlign: 'center',
                    color: ageColor,
                    backgroundColor: ageBg,
                }}
                align="right"
            >
                {props.age == null ? "None" : props.age + ageArrow}
            </TableCell>
            {/* Number */}
            <TableCell
                style={{
                    textAlign: 'center',
                    color: numColor,
                    backgroundColor: numBg,
                }}
                align="right"
            >
                {props.number == null ? "None" : props.number + numArrow}
            </TableCell>
        </TableRow>
    );
}

export default GuessRow;