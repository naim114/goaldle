import { Card, CardContent, Typography, Select, MenuItem, Button, Grid, LinearProgress, Box, Modal, TextField, FormControl, InputLabel, CircularProgress } from '@mui/material';
import React from 'react';
import { collection, orderBy, getDocs, query, doc, getDoc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { Player } from '../utils/model/player';
import { fetchTeam, fetchCountry, fetchPlayer } from '../utils/controller';
import DataTable from 'react-data-table-component';
import ActionIconButton from '../components/EditIconButton';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

function ManagePlayer(props) {
    const [loading, setLoading] = React.useState(false);
    const handleRefresh = () => {
        props.onRefresh();
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '80%',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        direction: 'column',
        overflow: 'scroll',
        display: 'block',
    };

    const deleteStyle = {
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

    const [pathBlank, setPathBlank] = React.useState(null);
    const [pathOri, setPathOri] = React.useState(null);
    // get storage
    const storage = getStorage();

    // get players
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

    // get team
    const [teamList, setTeamList] = React.useState([]);
    const getTeam = async () => {
        let datas = [];

        const querySnapshot = await getDocs(query(collection(db, "Team"), orderBy("name", "asc")));

        querySnapshot.forEach(async (doc) => {
            let data = await fetchTeam(doc.id);
            datas.push(data);
        });

        setTeamList(datas);
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

    // get country
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

    React.useEffect(() => {
        getPlayerX();
        getPlayers();
        getTeam();
        getCountry();
    }, []);

    // Add
    const [blankFile, setBlankFile] = React.useState("");
    function handleChangeBlank(event) {
        setBlankFile(event.target.files[0]);
    }
    const [oriFile, setOriFile] = React.useState("");
    function handleChangeOri(event) {
        setOriFile(event.target.files[0]);
    }
    const [newData, setNewData] = React.useState({
        age: '',
        country: 'hoNSbItgD2pZLeP9GErp',
        name: '',
        number: '',
        position: 'Goalkeeper',
        team: '4CWTyP5nDZUxz4pg2JHZ',
    });
    const [openAdd, setOpenAdd] = React.useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => {
        setOpenAdd(false);
        setNewData({
            age: '',
            country: 'hoNSbItgD2pZLeP9GErp',
            name: '',
            number: '',
            position: 'Goalkeeper',
            team: '4CWTyP5nDZUxz4pg2JHZ',
        });
        setOriFile("");
        setBlankFile("");
    };

    // Select Country to Edit/Delete
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteCheck, setDeleteCheck] = React.useState(true);
    const selectData = (value, action) => {
        setPathBlank('');
        setPathOri('');
        setOriFile("");
        setBlankFile("");
        setNewData({
            id: value.id,
            age: value.age,
            country: value.country.id,
            name: value.name,
            number: value.number,
            position: value.position,
            team: value.team.id,
        });
        if (action === 'edit') {
            console.log("Editing " + value.name);
            setOpenEdit(true);
            getDownloadURL(ref(storage, `player/${value.id}/blank.png`))
                .then((url) => {
                    setPathBlank(url);
                })
                .catch((error) => {
                    console.log(error);
                });
            getDownloadURL(ref(storage, `player/${value.id}/ori.png`))
                .then((url) => {
                    setPathOri(url);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (action === 'delete') {
            console.log("Deleting " + value.name);
            setOpenDelete(true);
        }
    }

    // Edit
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setNewData({
            age: '',
            country: 'hoNSbItgD2pZLeP9GErp',
            name: '',
            number: '',
            position: 'Goalkeeper',
            team: '4CWTyP5nDZUxz4pg2JHZ',
        });
        setPathBlank('');
        setPathOri('');
    };

    // Delete
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setNewData({
            age: '',
            country: 'hoNSbItgD2pZLeP9GErp',
            name: '',
            number: '',
            position: 'Goalkeeper',
            team: '4CWTyP5nDZUxz4pg2JHZ',
        });
        setDeleteCheck(true);
        setPathBlank('');
        setPathOri('');
    };
    const chekingDelete = (value) => {
        if (newData.name === value) {
            setDeleteCheck(false);
        } else {
            setDeleteCheck(true);
        }
    }

    // Datatable 
    const columns = [
        {
            name: 'Player',
            selector: row => row.name ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Team',
            selector: row => row.team.name ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Position',
            selector: row => row.position ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Country',
            selector: row => row.country.name ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Age',
            selector: row => row.age ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Number',
            selector: row => row.number ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            cell: (row) => <div><ActionIconButton action={"edit"} value={row} onClick={selectData} /><ActionIconButton action={"delete"} value={row} onClick={selectData} /></div>,
            button: true,
            ignoreRowClick: true,
            allowOverflow: true,
        },
    ];

    // Write Data
    const writeData = async (e) => {
        if (
            e.target.id === '' ||
            e.target.id === null
        ) {
            return false;
        }

        if (e.target.id === 'add') {
            // if there is empty field
            if (
                newData.name === '' ||
                newData.team === '' ||
                newData.position === '' ||
                newData.country === '' ||
                newData.age === '' ||
                newData.number === ''
            ) {
                return false;
            }

            if (!blankFile) {
                alert("Please upload player's blank image first!");
                return false;
            }

            if (!oriFile) {
                alert("Please upload player's original image first!");
                return false;
            }

            setLoading(true);

            // update to db
            console.log("Adding " + newData.name);
            try {
                // init data to firestore
                const docRef = await addDoc(collection(db, "Player"), {
                    age: newData.age,
                    country: newData.country,
                    name: newData.name,
                    number: newData.number,
                    position: newData.position,
                    showCount: 0,
                    team: newData.team,
                });

                console.log("Document written with ID: ", docRef.id);
                console.log("Added " + newData.name + " to Firestore");

                // upload blank image
                uploadBytes(ref(storage, `player/${docRef.id}/blank.png`), blankFile).then((snapshot) => {
                    console.log('Uploaded blank image!!');
                });

                // upload ori image
                uploadBytes(ref(storage, `player/${docRef.id}/ori.png`), oriFile).then((snapshot) => {
                    console.log('Uploaded ori image!!');
                });

                handleCloseAdd();
                handleRefresh();
            } catch (error) {
                console.log(error);
            }
        }
        else if (e.target.id === 'edit') {
            console.log('edit');
            //     // if there is empty field
            if (
                newData.name === '' ||
                newData.team === '' ||
                newData.position === '' ||
                newData.country === '' ||
                newData.age === '' ||
                newData.number === ''
            ) {
                return false;
            }

            if (!blankFile) {
                alert("Please upload player's blank image first!");
                return false;
            }

            if (!oriFile) {
                alert("Please upload player's original image first!");
                return false;
            }

            setLoading(true);

            // update to db
            console.log("Editing " + newData.id);
            try {
                await setDoc(doc(db, "Player", newData.id), {
                    age: newData.age,
                    country: newData.country,
                    name: newData.name,
                    number: newData.number,
                    position: newData.position,
                    showCount: 0,
                    team: newData.team,
                });

                // upload blank image
                uploadBytes(ref(storage, `player/${newData.id}/blank.png`), blankFile).then((snapshot) => {
                    console.log('Uploaded blank image!!');
                });

                // upload ori image
                uploadBytes(ref(storage, `player/${newData.id}/ori.png`), oriFile).then((snapshot) => {
                    console.log('Uploaded ori image!!');
                });

                handleRefresh();
                handleCloseEdit();
                console.log("Edited " + newData.id + " in Firestore");
            } catch (error) {
                console.log(error);
            }
        }
        else if (e.target.id === 'delete') {
            setLoading(true);
            console.log("Deleting " + newData.id);
            try {
                await deleteDoc(doc(db, "Player", newData.id));
                handleRefresh();
                handleCloseDelete();
                console.log("Deleted " + newData.id + " in Firestore");

                deleteObject(ref(storage, `player/${newData.id}/ori.png`)).then(() => {
                    console.log("Deleted ori image");
                }).catch((error) => {
                    console.log(error);
                });

                deleteObject(ref(storage, `player/${newData.id}/blank.png`)).then(() => {
                    console.log("Deleted blank image");
                }).catch((error) => {
                    console.log(error);
                });
            } catch (error) {
                console.log(error);
            }
        }
        setLoading(false);
    }

    return playerList.length === 0 || loading === true
        ?
        <LinearProgress />
        : (
            <div>
                <Card sx={{ backgroundColor: '#0a1929', color: 'white', padding: '10px' }}>
                    <CardContent>
                        <Typography variant="h4" component="div" style={{ marginBottom: '15px' }}>
                            Manage Player
                        </Typography>
                        <Button style={{ marginBottom: '10px' }} onClick={handleOpenAdd}>
                            Add Player +
                        </Button>
                        <DataTable
                            data={playerList}
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
                            Add Player
                        </Typography>
                        <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                            Filled in all field and press CONFIRM to add data. Blank and original image has to be lower than 2MB and in png format.
                        </Typography>
                        <TextField value={newData.name} onChange={(e) => setNewData({ ...newData, name: e.target.value })} label="Enter Name" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        {teamList.length === 0
                            ?
                            <CircularProgress />
                            :
                            <FormControl fullWidth>
                                <InputLabel>Select Team</InputLabel>
                                <Select
                                    value={newData.team}
                                    label="Select Team"
                                    onChange={(e) => setNewData({ ...newData, team: e.target.value })}
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    {
                                        teamList.map((team) => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        }
                        <FormControl fullWidth>
                            <InputLabel>Select Position</InputLabel>
                            <Select
                                value={newData.position}
                                label="Select Position"
                                onChange={(e) => setNewData({ ...newData, position: e.target.value })}
                                style={{ width: '100%', marginBottom: '10px' }}
                            >
                                <MenuItem value={"Goalkeeper"}>Goalkeeper</MenuItem>
                                <MenuItem value={"Defender"}>Defender</MenuItem>
                                <MenuItem value={"Midfielder"}>Midfielder</MenuItem>
                                <MenuItem value={"Forward"}>Forward</MenuItem>
                            </Select>
                        </FormControl>
                        {countryList.length === 0
                            ?
                            <CircularProgress />
                            :
                            <FormControl fullWidth>
                                <InputLabel>Select Country</InputLabel>
                                <Select
                                    value={newData.country}
                                    label="Select Country"
                                    onChange={(e) => setNewData({ ...newData, country: e.target.value })}
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    {
                                        countryList.map((country) => <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        }
                        <TextField value={newData.age} onChange={(e) => setNewData({ ...newData, age: e.target.value })} label="Enter Age" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        <TextField value={newData.number} onChange={(e) => setNewData({ ...newData, number: e.target.value })} label="Enter Number" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        <Button
                            variant="contained"
                            component="label"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            Upload Blank Image
                            <input
                                onChange={handleChangeBlank}
                                type="file"
                                hidden
                            />
                        </Button>
                        <Button
                            variant="contained"
                            component="label"
                            style={{ width: '100%', marginBottom: '30px' }}
                        >
                            Upload Original Image
                            <input
                                onChange={handleChangeOri}
                                type="file"
                                hidden
                            />
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            id={'add'}
                            onClick={writeData}
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
                            Edit Player
                        </Typography>
                        <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                            Filled in all field and press CONFIRM to add data. Blank and original image has to be lower than 2MB and in png format.
                        </Typography>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            {
                                pathBlank === null || pathBlank === ''
                                    ? <CircularProgress />
                                    : <img
                                        src={pathBlank}
                                        alt={"Blank Image"}
                                        height={'150px'}
                                        style={{ marginBottom: '20px' }}
                                    />
                            }
                            {
                                pathOri === null || pathOri === ''
                                    ? <CircularProgress />
                                    : <img
                                        src={pathOri}
                                        alt={"Original Image"}
                                        height={'150px'}
                                        style={{ marginBottom: '20px' }}
                                    />
                            }
                        </Grid>
                        <TextField value={newData.name} onChange={(e) => setNewData({ ...newData, name: e.target.value })} label="Enter Name" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        {teamList.length === 0
                            ?
                            <CircularProgress />
                            :
                            <FormControl fullWidth>
                                <InputLabel>Select Team</InputLabel>
                                <Select
                                    value={newData.team}
                                    label="Select Team"
                                    onChange={(e) => setNewData({ ...newData, team: e.target.value })}
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    {
                                        teamList.map((team) => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        }
                        <FormControl fullWidth>
                            <InputLabel>Select Position</InputLabel>
                            <Select
                                value={newData.position}
                                label="Select Position"
                                onChange={(e) => setNewData({ ...newData, position: e.target.value })}
                                style={{ width: '100%', marginBottom: '10px' }}
                            >
                                <MenuItem value={"Goalkeeper"}>Goalkeeper</MenuItem>
                                <MenuItem value={"Defender"}>Defender</MenuItem>
                                <MenuItem value={"Midfielder"}>Midfielder</MenuItem>
                                <MenuItem value={"Forward"}>Forward</MenuItem>
                            </Select>
                        </FormControl>
                        {countryList.length === 0
                            ?
                            <CircularProgress />
                            :
                            <FormControl fullWidth>
                                <InputLabel>Select Country</InputLabel>
                                <Select
                                    value={newData.country}
                                    label="Select Country"
                                    onChange={(e) => setNewData({ ...newData, country: e.target.value })}
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    {
                                        countryList.map((country) => <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        }
                        <TextField value={newData.age} onChange={(e) => setNewData({ ...newData, age: e.target.value })} label="Enter Age" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        <TextField value={newData.number} onChange={(e) => setNewData({ ...newData, number: e.target.value })} label="Enter Number" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        <Button
                            variant="contained"
                            component="label"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            Upload Blank Image
                            <input
                                onChange={handleChangeBlank}
                                type="file"
                                hidden
                            />
                        </Button>
                        <Button
                            variant="contained"
                            component="label"
                            style={{ width: '100%', marginBottom: '30px' }}
                        >
                            Upload Original Image
                            <input
                                onChange={handleChangeOri}
                                type="file"
                                hidden
                            />
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            id={'edit'}
                            onClick={writeData}
                            disable={loading}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Modal>{/* Delete Modal */}
                <Modal
                    open={openDelete}
                    onClose={handleCloseDelete}
                >
                    <Box sx={deleteStyle}>
                        <Typography variant="h6" component="h2">
                            Delete Player
                        </Typography>
                        <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                            After delete the data can't be retrieve back. To Delete enter <b>{newData.name}</b> in the field then click CONFIRM.
                        </Typography>
                        <TextField onChange={(e) => chekingDelete(e.target.value)} name='name' variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        <Button
                            color="error"
                            variant="contained"
                            id={'delete'}
                            disabled={deleteCheck}
                            onClick={writeData}
                            disable={loading}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Modal>

            </div>
        );
}

export default ManagePlayer;