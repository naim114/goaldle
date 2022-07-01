import { Card, CardContent, Typography, Select, MenuItem, Button, LinearProgress, Box, Modal, TextField } from '@mui/material';
import React from 'react';
import { collection, orderBy, getDocs, query, doc, getDoc, setDoc, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from '../utils/firebase';
import { Player } from '../utils/model/player';
import { fetchTeam, fetchCountry, fetchLeague } from '../utils/controller';
import DataTable from 'react-data-table-component';
import ActionIconButton from '../components/EditIconButton';

function ManageLeague() {
    const [dataList, setDataList] = React.useState([]);
    const getData = async () => {
        let datas = [];

        const querySnapshot = await getDocs(query(collection(db, "League"), orderBy("name", "asc")));

        querySnapshot.forEach(async (doc) => {
            let data = await fetchLeague(doc.id);
            datas.push(data);
        });

        setDataList(datas);
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
        getData();
    }, []);

    // Datatable 
    const columns = [
        {
            name: 'League',
            selector: row => row.name ?? 'None',
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
            name: 'Action',
            cell: (row) => <div><ActionIconButton action={"edit"} value={row} /><ActionIconButton action={"delete"} value={row} /></div>,
            button: true,
            ignoreRowClick: true,
            allowOverflow: true,
        },
    ];

    return dataList.length === 0
        ?
        <LinearProgress />
        : (
            <div>
                <Card sx={{ backgroundColor: '#0a1929', color: 'white', padding: '10px' }}>
                    <CardContent>
                        <Typography variant="h4" component="div" style={{ marginBottom: '15px' }}>
                            Manage League
                        </Typography>
                        <Button style={{ marginBottom: '10px' }}>
                            Add League +
                        </Button>
                        <DataTable
                            data={dataList}
                            columns={columns}
                            pagination
                        />
                    </CardContent>
                </Card>
            </div>
        );
}

export default ManageLeague;