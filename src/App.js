import * as React from 'react';
import { ThemeProvider } from '@mui/system';
import theme from './assets/theme';
import ButtonAppBar from './components/ButtonAppBar';
import { CircularProgress, Grid, Typography } from '@mui/material';
import Footer from './components/Footer';
import GoaldleLogo from './components/GoaldleLogo';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { doc, getDoc } from "firebase/firestore";
import { db } from './utils/firebase';
import { Player } from './utils/model/player';
import { fetchTeam, fetchCountry } from './utils/controller';
import GoaldleTableRow from './components/GoaldleTableRow';
import HTPModal from './components/HTPModal';
import ResultModal from './components/ResultModal';
import GoaldleAutocomplete from './components/GoaldleAutocomplete';

function App() {
  const [playerX, setPlayerX] = React.useState(null);

  const [openHTP, setOpenHTP] = React.useState(true);
  const handleOpenHTP = () => setOpenHTP(true);
  const handleCloseHTP = () => setOpenHTP(false);

  const [openResult, setOpenResult] = React.useState(false);
  const handleOpenResult = () => setOpenResult(true);
  const handleCloseResult = () => setOpenResult(false);

  const [result, setResult] = React.useState(false);

  const [guess, setGuess] = React.useState([]);
  const [label, setLabel] = React.useState("Select a player");
  const [game, setGame] = React.useState(false);

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
  }, []);

  const addGuess = (player) => {
    if (guess.length < 8 && !game) {
      console.log("Selected Player: \n" + player.name);
      setGuess((prev) => [...prev, player]);
      if (guess.length === 7) {
        // LOSE
        setLabel(`Guess 8 of 8`);
        setResult(false);
        handleOpenResult();
      } else {
        setLabel(`Guess ${guess.length + 1} of 8`);
        if (player.id === playerX.id) {
          console.log("🟩🟩🟩🟩🟩🟩");
          // WIN
          setGame(true);
          setResult(true);
          handleOpenResult();
        }
      }
    }
  }

  // TODO put donation banner
  // TODO copyable share result
  // TODO PROABLY use node.js to generate new player everyday

  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar
        onClickHTP={handleOpenHTP}
      />
      <Grid container spacing={2} style={{ height: '100%', padding: '10px', marginBottom: '30px', marginTop: '30px' }} >
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
            playerX === null
              ?
              <CircularProgress />
              :
              <img src={require(`./assets/players/${playerX.id}/blank.png`)} alt={"Mystery Player"} height={'250px'} style={{ marginBottom: '20px' }} />
          }
          <Typography variant="h5">
            Can you guess this
          </Typography>
          <Typography variant="h3" style={{ fontWeight: 'bolder' }}>
            PLAYER X?
          </Typography>
          <Divider style={{ width: '80%', marginTop: '30px', marginBottom: '30px' }} sx={{ borderBottomWidth: 3, borderColor: 'white' }} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="column"
          justifyContent="flex-start"
        >
          <GoaldleAutocomplete
            label={label}
            onChange={addGuess}
          />
          <TableContainer style={{ backgroundColor: '#1a2027', marginBottom: '30px' }}>
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
                {
                  guess.length === 0
                    ? null
                    : guess.map((player, index) => (
                      <GoaldleTableRow
                        key={index}
                        index={index}
                        player={player}
                        playerX={playerX}
                      />
                    ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Footer />
      {/* How To Play Modal */}
      <HTPModal
        open={openHTP}
        onClose={handleCloseHTP}
      />
      {playerX === null
        ? null
        : <ResultModal
          open={openResult}
          onClose={handleCloseResult}
          playerX={playerX}
          result={result}
          guess={guess.length}
        />}
    </ThemeProvider>
  );
}

export default App;
