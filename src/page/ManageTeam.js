import { Card, CardContent, Typography, Select, MenuItem, Button, LinearProgress, Box, Modal, TextField, FormControl, InputLabel, CircularProgress } from '@mui/material';
import React from 'react';
import { collection, orderBy, getDocs, query, doc, getDoc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { Player } from '../utils/model/player';
import { fetchTeam, fetchCountry, fetchLeague } from '../utils/controller';
import DataTable from 'react-data-table-component';
import ActionIconButton from '../components/EditIconButton';

function ManageTeam(props) {
    const [loading, setLoading] = React.useState(false);
    const handleRefresh = () => {
        props.onRefresh();
    }
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

    // get league
    const [leagueList, setLeagueList] = React.useState([]);
    const getLeague = async () => {
        let datas = [];

        const querySnapshot = await getDocs(query(collection(db, "League"), orderBy("name", "asc")));

        querySnapshot.forEach(async (doc) => {
            let data = await fetchLeague(doc.id);
            datas.push(data);
        });

        setLeagueList(datas);
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
        getTeam();
        getLeague();
    }, []);

    // Add
    const [newData, setNewData] = React.useState({
        name: '',
        league: 'jPRHJoJSiqE6zYThYm1R',
    });
    const [openAdd, setOpenAdd] = React.useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => {
        setOpenAdd(false);
        setNewData({
            name: '',
            league: 'jPRHJoJSiqE6zYThYm1R',
        });
    };

    // Select Country to Edit/Delete
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteCheck, setDeleteCheck] = React.useState(true);
    const [select, setSelect] = React.useState({
        name: '',
        league: 'jPRHJoJSiqE6zYThYm1R',
    });
    const selectData = (value, action) => {
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
            name: '',
            league: 'jPRHJoJSiqE6zYThYm1R',
        });
    };

    // Delete
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelect({
            name: '',
            country: 'hoNSbItgD2pZLeP9GErp',
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

    // Datatable 
    const columns = [
        {
            name: 'Team',
            selector: row => row.name ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'League',
            selector: row => row.league.name ?? 'None',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Country',
            selector: row => row.league.country.name ?? 'None',
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
        if (e.target.id === '' || e.target.id === null) {
            return false;
        }

        if (e.target.id === 'add') {
            // if there is empty field
            if (
                newData.name === '' ||
                newData.league === ''
            ) {
                return false;
            }
            setLoading(true);

            // update to db
            console.log("Adding " + newData.name);
            try {
                const docRef = await addDoc(collection(db, "Team"), {
                    name: newData.name,
                    league: newData.league,
                });

                console.log("Document written with ID: ", docRef.id);
                handleCloseAdd();
                console.log("Added " + newData.name + " to Firestore");
                handleRefresh();
            } catch (error) {
                console.log(error);
            }
        }
        else if (e.target.id === 'edit') {
            console.log('edit');
            // if there is empty field
            if (
                select.name === '' ||
                select.league === ''
            ) {
                return false;
            }
            setLoading(true);

            // update to db
            console.log("Editing " + select.id);
            try {
                await setDoc(doc(db, "Team", select.id), {
                    name: select.name,
                    league: select.league.id,
                });
                handleRefresh();
                handleCloseEdit();
                console.log("Edited " + select.id + " in Firestore");
            } catch (error) {
                console.log(error);
            }
        }
        else if (e.target.id === 'delete') {
            setLoading(true);
            console.log("Deleting " + select.id);
            try {
                await deleteDoc(doc(db, "Team", select.id));
                handleRefresh();
                handleCloseDelete();
                console.log("Deleted " + select.id + " in Firestore");
            } catch (error) {
                console.log(error);
            }
        }
        setLoading(false);
    }

    return teamList.length === 0 || loading === true
        ?
        <LinearProgress />
        : (
            <div>
                <Card sx={{ backgroundColor: '#0a1929', color: 'white', padding: '10px' }}>
                    <CardContent>
                        <Typography variant="h4" component="div" style={{ marginBottom: '15px' }}>
                            Manage Team
                        </Typography>
                        <Button style={{ marginBottom: '10px' }} onClick={handleOpenAdd}>
                            Add Team +
                        </Button>
                        <DataTable
                            data={teamList}
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
                            Add Team
                        </Typography>
                        <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                            Filled in all field and press CONFIRM to add data.
                        </Typography>
                        <TextField value={newData.name} onChange={(e) => setNewData({ ...newData, name: e.target.value })} name='name' label="Enter Name" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        {leagueList.length === 0
                            ?
                            <CircularProgress />
                            :
                            <FormControl fullWidth>
                                <InputLabel>Select League</InputLabel>
                                <Select
                                    value={newData.league}
                                    label="Select Country"
                                    onChange={(e) => setNewData({ ...newData, league: e.target.value })}
                                    style={{ width: '100%', marginBottom: '30px' }}
                                >
                                    {
                                        leagueList.map((league) => <MenuItem key={league.id} value={league.id}>{league.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        }
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
                            Edit Team
                        </Typography>
                        <Typography sx={{ mt: 2, marginBottom: '20px' }}>
                            Filled in all field and press CONFIRM to edit data.
                        </Typography>
                        <TextField value={select.name} onChange={(e) => setSelect({ ...select, name: e.target.value })} name='name' label="Enter Name" variant="outlined" style={{ width: '100%', marginBottom: '10px' }} />
                        {leagueList.length === 0
                            ?
                            <CircularProgress />
                            :
                            <FormControl fullWidth>
                                <InputLabel>Select League</InputLabel>
                                <Select
                                    value={select.league.id}
                                    label="Select Country"
                                    onChange={(e) => setSelect({ ...select, league: e.target.value })}
                                    style={{ width: '100%', marginBottom: '30px' }}
                                >
                                    {
                                        leagueList.map((league) => <MenuItem key={league.id} value={league.id}>{league.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        }
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
                </Modal>
                {/* Delete Modal */}
                <Modal
                    open={openDelete}
                    onClose={handleCloseDelete}
                >
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            Delete Team
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

export default ManageTeam;