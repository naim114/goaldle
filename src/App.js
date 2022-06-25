import * as React from 'react';
import { ThemeProvider } from '@mui/system';
import theme from './assets/theme';
import ButtonAppBar from './components/ButtonAppBar';
import { Grid, Typography } from '@mui/material';
import Footer from './components/Footer';
import GoaldleLogo from './components/GoaldleLogo';
import Divider from '@mui/material/Divider';
import initialImg from './assets/sample.png';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar />
      <Grid container spacing={2} >
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
          <Divider style={{ width: '80%', marginBottom: '30px' }} sx={{ borderBottomWidth: 3, borderColor: 'black' }} />
          <img src={initialImg} height={'300px'} />
          <Typography variant="h5">
            Can you guess this
          </Typography>
          <Typography variant="h3" style={{ fontWeight: 'bolder' }}>
            MYSTERY PLAYER?
          </Typography>
          <Divider style={{ width: '80%', marginTop: '30px' }} sx={{ borderBottomWidth: 3, borderColor: 'black' }} />
        </Grid>
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
          <GoaldleLogo />

        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
