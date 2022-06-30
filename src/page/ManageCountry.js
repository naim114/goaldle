import { Card, CardContent, Typography, Select, MenuItem, Button, LinearProgress, Box, Modal, IconButton, TextField } from '@mui/material';
import React from 'react';
import { collection, orderBy, getDocs, query, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { Player } from '../utils/model/player';
import { fetchTeam, fetchCountry } from '../utils/controller';
import DataTable from 'react-data-table-component';
import ActionIconButton from '../components/EditIconButton';

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

    const handleRefresh = () => {
        props.onRefresh();
    }

    // Add
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

    // Select Country to Edit/Delete
    const [openEdit, setOpenEdit] = React.useState(false);
    const [select, setSelect] = React.useState({
        id: '',
        name: '',
        continent: 'Africa',
    });
    const selectCountry = (value, action) => {
        setSelect(value);
        if (action === 'edit') {
            console.log("Editing " + value.name);
            setOpenEdit(true);
        } else if (action === 'delete') {
            console.log("Deleting " + value.name);
        }
    }

    // Edit
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelect({
            id: '',
            name: '',
            continent: 'Africa',
        });
    };

    // Write Data
    const writeCountry = async (e) => {
        if (e.target.id === '' || e.target.id === null) {
            return false;
        }

        if (e.target.id === 'add') {
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
                handleRefresh();
                handleCloseAdd();
                console.log("Added " + docID + " to Firestore");
            } catch (error) {
                console.log(error);
            }
        } else if (e.target.id === 'edit') {
            console.log("Ha facts");
            // if there is empty field
            if (
                select.name === '' ||
                select.continent === ''
            ) {
                return false;
            }

            // update to db
            console.log("Editing " + select.id);
            try {
                await setDoc(doc(db, "Country", select.id), {
                    name: select.name,
                    continent: select.continent,
                });
                handleRefresh();
                handleCloseEdit();
                console.log("Edited " + select.id + " in Firestore");
            } catch (error) {
                console.log(error);
            }
        }
    }

    // Datatable 
    const columns = [
        {
            name: 'Country',
            selector: row => row.name,
        },
        {
            name: 'Continent',
            selector: row => row.continent,
        },
        {
            name: 'Action',
            cell: (row) => <div><ActionIconButton action={"edit"} value={row} onClick={selectCountry} /><ActionIconButton action={"delete"} value={row} onClick={selectCountry} /></div>,
            button: true,
            ignoreRowClick: true,
            allowOverflow: true,
        },
    ];

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
                        <DataTable
                            data={countryList}
                            columns={columns}
                            dense
                            pagination
                        />
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
                            id={'add'}
                            onClick={writeCountry}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Modal>
                {/* Edit Modal */}
                <Modal
                    open={openEdit}
                    onClose={handleCloseEdit}
                >
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            Edit Country
                        </Typography>
                        <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                            Filled in all field and press Confirm to edit data.
                        </Typography>
                        <TextField value={select.name} onChange={(e) => setSelect({ ...select, name: e.target.value })} name='name' label="Enter Name" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        <Select
                            name='continent'
                            value={select.continent}
                            style={{ width: '100%', marginBottom: '30px' }}
                            onChange={(e) => setSelect({ ...select, continent: e.target.value })}
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
                            id={'edit'}
                            onClick={writeCountry}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Modal>
            </div>
        );
}

export default ManageCountry;