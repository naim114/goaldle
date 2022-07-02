import { Card, CardContent, Typography, Select, MenuItem, Button, LinearProgress, Box, Modal, TextField, FormControl, InputLabel } from '@mui/material';
import React from 'react';
import { collection, orderBy, getDocs, query, doc, getDoc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { Player } from '../utils/model/player';
import { fetchTeam, fetchCountry } from '../utils/controller';
import DataTable from 'react-data-table-component';
import ActionIconButton from '../components/EditIconButton';

function ManageCountry(props) {
    const [loading, setLoading] = React.useState(false);
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
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteCheck, setDeleteCheck] = React.useState(true);
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
            setOpenDelete(true);
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

    // Delete
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelect({
            id: '',
            name: '',
            continent: 'Africa',
        });
        setDeleteCheck(true);
    };
    const chekingDelete = (value) => {
        if (select.name === value) {
            setDeleteCheck(false);
        } else {
            setDeleteCheck(true);
        }
    }

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
            setLoading(true);

            // update to db
            console.log("Adding " + newCountry.name);
            try {
                const docRef = await addDoc(collection(db, "Country"), {
                    name: newCountry.name,
                    continent: newCountry.continent,
                });

                console.log("Document written with ID: ", docRef.id);

                handleRefresh();
                handleCloseAdd();
                console.log("Added " + newCountry.name + " to Firestore");
            } catch (error) {
                console.log(error);
            }
        } else if (e.target.id === 'edit') {
            // if there is empty field
            if (
                select.name === '' ||
                select.continent === ''
            ) {
                return false;
            }
            setLoading(true);

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
        } else if (e.target.id === 'delete') {
            setLoading(true);
            console.log("Deleting " + select.id);
            try {
                await deleteDoc(doc(db, "Country", select.id));
                handleRefresh();
                handleCloseDelete();
                console.log("Deleted " + select.id + " in Firestore");
            } catch (error) {
                console.log(error);
            }
        }
        setLoading(false);
    }

    // Datatable 
    const columns = [
        {
            name: 'Country',
            selector: row => row.name ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Continent',
            selector: row => row.continent ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            cell: (row) => <div><ActionIconButton action={"edit"} value={row} onClick={selectCountry} /><ActionIconButton action={"delete"} value={row} onClick={selectCountry} /></div>,
            button: true,
            ignoreRowClick: true,
            allowOverflow: true,
        },
    ];

    return countryList.length === 0 || loading === true
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
                            Filled in all field and press CONFIRM to add data.
                        </Typography>
                        <TextField value={newCountry.name} onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })} name='name' label="Enter Name" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        <FormControl fullWidth>
                            <InputLabel>Select Continent</InputLabel>
                            <Select
                                value={newCountry.continent}
                                label="Select Continent"
                                onChange={(e) => setNewCountry({ ...newCountry, continent: e.target.value })}
                                style={{ width: '100%', marginBottom: '30px' }}
                            >
                                <MenuItem value={"Africa"}>Africa</MenuItem>
                                <MenuItem value={"America"}>America</MenuItem>
                                <MenuItem value={"Asia"}>Asia</MenuItem>
                                <MenuItem value={"Europe"}>Europe</MenuItem>
                                <MenuItem value={"Oceania"}>Oceania</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            color="secondary"
                            variant="contained"
                            id={'add'}
                            onClick={writeCountry}
                            disable={loading}
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
                            Filled in all field and press CONFIRM to edit data.
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
                            disable={loading}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Modal>
                {/* Delete Modal */}
                <Modal
                    open={openDelete}
                    onClose={handleCloseDelete}
                >
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            Delete Country
                        </Typography>
                        <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                            After delete the data can't be retrieve back. To Delete enter <b>{select.name}</b> in the field then click CONFIRM.
                        </Typography>
                        <TextField onChange={(e) => chekingDelete(e.target.value)} name='name' variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        <Button
                            color="error"
                            variant="contained"
                            id={'delete'}
                            disabled={deleteCheck}
                            onClick={writeCountry}
                            disable={loading}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Modal>
            </div>
        );
}

export default ManageCountry;