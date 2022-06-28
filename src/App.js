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
import { doc, getDoc } from "firebase/firestore";
import { db } from './utils/firebase';
import { Player } from './utils/model/player';
import { fetchTeam, fetchCountry } from './utils/controller';
import GoaldleTableRow from './components/GoaldleTableRow';

// import initialImg from './assets/sample.png';
// aL9l6YI1K9oU2KicAH9b

function App() {
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

  React.useEffect(() => {
    getPlayerX();
  }, []);

  const [guess, setGuess] = React.useState([]);
  const [label, setLabel] = React.useState("Select a player");
  const [game, setGame] = React.useState(false);

  const addGuess = (player) => {
    if (guess.length < 8 && !game) {
      console.log("Selected Player: \n" + player.name);
      setGuess((prev) => [...prev, player]);
      if (guess.length === 7) {
        // LOSE
        console.log('X');
        setLabel(`Guess 8 of 8`);
      } else {
        setLabel(`Guess ${guess.length + 1} of 8`);
        if (player.id === playerX.id) {
          // WIN
          setGame(true);
          console.log('YOU WON!!!');
        }
      }
    }
  }

  const defaultStyle = {
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#edeae5',
  };

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
          {
            playerX === null
              ?
              <CircularProgress />
              :
              <img src={require(`${playerX.pathBlank}`)} alt={"Mystery Player"} height={'250px'} style={{ marginBottom: '20px' }} />
            // <p>{playerX.team.league.id}</p>
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
          justifyContent="center"
        >
          <GoaldleInput
            label={label}
            onChange={addGuess}
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
    </ThemeProvider>
  );
}

export default App;
