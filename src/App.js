import * as React from 'react';
import { ThemeProvider } from '@mui/system';
import theme from './assets/theme';
import ButtonAppBar from './components/ButtonAppBar';
import { CircularProgress, Grid, Typography } from '@mui/material';
import Footer from './components/Footer';
import GoaldleLogo from './components/GoaldleLogo';
import Divider from '@mui/material/Divider';
import GoaldleInput from './components/GoaldleInput';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import GuessRow from './components/GuessRow';
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from './utils/firebase';
import { Player } from './utils/model/player';
import { fetchTeam, fetchCountry, fetchPlayer } from './utils/controller';

// import initialImg from './assets/sample.png';
// aL9l6YI1K9oU2KicAH9b

function App() {
  const [playerList, setPlayerList] = React.useState([]);
  const [playerX, setPlayerX] = React.useState(new Player());

  const getPlayerX = async () => {
    // get playerX id on settings
    let playerX = '';

    const docRef1 = doc(db, "Settings", "settings_mystery_player");
    const docSnap1 = await getDoc(docRef1);

    if (docSnap1.exists()) {
      playerX = docSnap1.data().id;
      console.log(playerX);
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
        docSnap.data().pathBlank,
        docSnap.data().pathOri,
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

  const getPlayers = async () => {
    let players = [];

    const querySnapshot = await getDocs(collection(db, "Player"));
    querySnapshot.forEach(async (doc) => {
      let player = await fetchPlayer(doc.id);
      players.push(player);
    });

    setPlayerList(players);
    return true;
  }

  React.useEffect(() => {
    getPlayers();
    getPlayerX();
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar />
      <Grid container spacing={2} style={{ height: '100%', padding: '10px', marginBottom: '40px' }} >
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign={'center'}
        >
          <GoaldleLogo />
          <Divider style={{ width: '80%', marginBottom: '30px' }} sx={{ borderBottomWidth: 3, borderColor: 'white' }} />
          {/* {
            playerX == null
              ?
              <CircularProgress />
              :
              <img src={require(`${playerX.data.pathBlank}`)} alt={"Mystery Player"} height={'250px'} />
          } */}
          {
            <div>
              <p>{JSON.stringify(playerList)}</p>
              <p>{JSON.stringify(playerX)}</p>
            </div>
          }
          <Typography variant="h5">
            Can you guess this
          </Typography>
          <Typography variant="h3" style={{ fontWeight: 'bolder' }}>
            MYSTERY PLAYER?
          </Typography>
          <Divider style={{ width: '80%', marginTop: '30px', marginBottom: '30px' }} sx={{ borderBottomWidth: 3, borderColor: 'white' }} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="column"
          justifyContent="center"
        >
          {/* <GoaldleInput
            label={"Guess 1 of 8"}
            onChange={(value) => {
              console.log("Selected player: " + value);
            }}
            playerList={playerList}
          /> */}
          <TableContainer style={{ backgroundColor: '#1a2027' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell align="right" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Team</TableCell>
                  <TableCell align="right" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Position</TableCell>
                  <TableCell align="right" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Country</TableCell>
                  <TableCell align="right" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Age</TableCell>
                  <TableCell align="right" style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {rows.map((row) => (
                  <GuessRow
                    id={row.id}
                    name={row.name}
                    team={row.team}
                    position={row.position}
                    country={row.country}
                    age={row.age}
                    number={row.number}
                    nameStatus={null}
                    teamStatus={'success'}
                    posStatus={'success'}
                    countryStatus={'success'}
                    ageStatus={'high'}
                    numStatus={'low'}
                  />
                ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
