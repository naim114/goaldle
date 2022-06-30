import { Card, CardContent, Typography, Select, MenuItem, Button, LinearProgress, Box, Modal, IconButton, TextField } from '@mui/material';
import React from 'react';
import { collection, orderBy, getDocs, query, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { Player } from '../utils/model/player';
import { fetchTeam, fetchCountry } from '../utils/controller';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ManageCountry(props) {
    const [countryList, setCountryList] = React.useState([]);

    const getCountry = async () => {
        let countries = [];

        const querySnapshot = await getDocs(query(collection(db, "Country"), orderBy("name", "asc")));

        querySnapshot.forEach(async (doc) => {
            let country = await fetchCountry(doc.id);
            countries.push(country);
        });

        setCountryList(countries);
    }

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
        getCountry();
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
        direction: 'column',
    };

    const [newCountry, setNewCountry] = React.useState({
        name: '',
        continent: 'Africa',
    });

    const [openAdd, setOpenAdd] = React.useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => {
        setOpenAdd(false);
        setNewCountry({
            name: '',
            continent: 'Africa',
        });
    };

    const handleRefresh = () => {
        props.onRefresh();
    }

    const addCountry = async () => {
        // if there is empty field
        if (
            newCountry.name === '' ||
            newCountry.continent === ''
        ) {
            return false;
        }

        // generate doc id
        let name = newCountry.name.replace(/[^a-zA-Z ]/g, "");
        name = name.replace(/ /g, '_');
        const docID = newCountry.continent.toLowerCase() + "_" + name.toLowerCase();

        // update to db
        console.log("Adding " + docID);
        try {
            await setDoc(doc(db, "Country", docID), {
                name: newCountry.name,
                continent: newCountry.continent,
            });
            console.log("Added " + docID + " to Firestore");
            handleRefresh();
            handleCloseAdd();
            console.log("Added " + docID + " to Firestore");
        } catch (error) {
            console.log(error);
        }
    }

    return countryList.length === 0
        ?
        <LinearProgress />
        : (
            <div>
                <Card sx={{ backgroundColor: '#0a1929', color: 'white', padding: '10px' }}>
                    <CardContent>
                        <Typography variant="h4" component="div" style={{ marginBottom: '15px' }}>
                            Manage Country
                        </Typography>
                        <Button style={{ marginBottom: '10px' }} onClick={handleOpenAdd}>
                            Add Country +
                        </Button>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Continent</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {countryList.map((country) => (
                                        <TableRow
                                            key={country.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {country.name}
                                            </TableCell>
                                            <TableCell align="right">{country.continent}</TableCell>
                                            <TableCell align="right">
                                                <IconButton>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
                {/* Add Modal */}
                <Modal
                    open={openAdd}
                    onClose={handleCloseAdd}
                >
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            Add Country
                        </Typography>
                        <form onSubmit={addCountry}>
                            <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                                Filled in all field and press Confirm to add data.
                            </Typography>
                            <TextField value={newCountry.name} onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })} name='name' label="Enter Name" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                            <Select
                                name='continent'
                                value={newCountry.continent}
                                style={{ width: '100%', marginBottom: '30px' }}
                                onChange={(e) => setNewCountry({ ...newCountry, continent: e.target.value })}
                            >
                                <MenuItem value={"Africa"}>Africa</MenuItem>
                                <MenuItem value={"America"}>America</MenuItem>
                                <MenuItem value={"Asia"}>Asia</MenuItem>
                                <MenuItem value={"Europe"}>Europe</MenuItem>
                                <MenuItem value={"Oceania"}>Oceania</MenuItem>
                            </Select>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={addCountry}
                            >
                                Confirm
                            </Button>
                        </form>
                    </Box>
                </Modal>
            </div>
        );
}

export default ManageCountry;