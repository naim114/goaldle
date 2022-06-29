import * as React from 'react';
import { ThemeProvider } from '@mui/system';
import theme from './assets/theme';
import ButtonAppBar from './components/ButtonAppBar';
import Footer from './components/Footer';
import HTPModal from './components/HTPModal';
import Homepage from './page/Homepage';
import Backdoor from './page/Backdoor';

function App() {
  const [openHTP, setOpenHTP] = React.useState(true);
  const handleOpenHTP = () => setOpenHTP(true);
  const handleCloseHTP = () => setOpenHTP(false);

  const [main, setMain] = React.useState(<Homepage />);

  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar
        onClickHTP={handleOpenHTP}
        accessBackdoor={(e) => {
          if (e.detail === 3) {
            setMain(
              <Backdoor
                goBackHome={() => {
                  setMain(<Homepage />);
                }}
              />
            );
          }
        }}
      />
      {main}
      <Footer />
      {/* How To Play Modal */}
      <HTPModal
        open={openHTP}
        onClose={handleCloseHTP}
      />
    </ThemeProvider >
  );
}

export default App;
