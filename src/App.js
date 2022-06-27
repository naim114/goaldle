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
import { collection, query, orderBy, onSnapshot, where, getDoc, doc } from "firebase/firestore";
import { db } from './utils/firebase';
import { Player } from './utils/model/player';
import { getPlayers } from './utils/controller';

// import initialImg from './assets/sample.png';

function App() {
  const [playerList, setPlayerList] = React.useState([]);
  const [mystery, setMystery] = React.useState();

  // NOTE: real-time function
  React.useEffect(() => {
    const players_queries = query(collection(db, 'Player'), orderBy('name', 'desc'));
    onSnapshot(players_queries, (querySnapshot) => {

      let list = querySnapshot.docs;

      let player = list[0];
      // let player = list[new Date().getDate()];

      setMystery(new Player(
        player.id,
        player.data().age,
        player.data().country,
        player.data().name,
        player.data().number,
        player.data().pathBlank,
        player.data().pathOri,
        player.data().position,
        player.data().showCount,
        player.data().team,
      ));

      setPlayerList(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })));
    });
  }, [playerList, mystery]);

  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar />
      <Grid container spacing={2} style={{ height: '100%', padding: '10px', marginBottom: '10px' }} >
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
          {
            mystery == null
              ?
              <CircularProgress />
              :
              <img src={require(`${mystery.pathBlank}`)} alt={"Mystery Player"} height={'250px'} />
          }
          <p>{JSON.stringify(mystery)}</p>
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
          <GoaldleInput
            label={"Guess 1 of 8"}
            onChange={(value) => {
              console.log("Selected player: " + value);
            }}
            playerList={playerList}
          />
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
