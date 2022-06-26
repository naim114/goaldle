import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#5cdb94',
        },
        secondary: {
            main: '#05386b',
        },
    },
    typography: {
        allVariants: {
            fontFamily: `'Work Sans', sans-serif`,
        },
    },
});

export default theme;