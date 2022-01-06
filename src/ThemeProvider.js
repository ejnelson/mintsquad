import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material'

export const primary = {
    main: '#336cd9',
    light: '#E0F3F4',
    dark: '#391085',
    action: '#333333',
    contrastText: '#fff',
    success: '#008300',
    border: '1px solid #E6E6EB',
    borderDark: '1px solid #333333',
}

export const error = {
    warning: '#FDE30B',
    main: '#B85300',
    secondary: '#F9E0E0',
    light: '#FEF7B6',
}

export const background = {
    main: '#FFF',
    light: '#9E76DA',
    dark: '#391085',
    mediumDark: '#7940b5',
    ultraLight: '#F7F7F7',
    exclude: '#EEE5F6',
}

const theme = createTheme({
    typography: {
        fontFamily: 'Inter, Roboto, sans-serif',

        h1: {
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '1px',
        },
        h2: {
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '0px',
        },
    },
    palette: {
        primary: primary,
        error: error,
        background: background,
    },
    // components: {
    //     MuiCssBaseline: {
    //         styleOverrides: `
    //       @font-face {
    //         font-family: 'Inter';
    //         font-style: normal;
    //         font-display: swap;
    //         font-weight: 400;
    //       }
    //     `,
    //     },
    // },
})

export const ThemeProvider = ({ children }) => {
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
