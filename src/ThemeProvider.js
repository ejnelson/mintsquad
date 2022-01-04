import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material'

export const primary = {
    main: '#336cd9',
    light: '#E0F3F4',
    dark: '#006978',
    action: '#333333',
    contrastText: '#fff',
    success: '#008300',
    border: '1px solid #E6E6EB',
    borderDark: '1px solid #333333',
}

export const secondary = {
    light: '#F7F7F7',
    main: '#D6D6D6',
    dark: '#888888',
    darker: '#666666',
    darkest: '#333333',
    disabled: '#D6D6D6',
    blue: '#E7EDFA',
    darkBlue: '#8DB8FF',
    green: '#E0F4E0',
    pink: '#E5007F',
    purple: '#CBAFFA',
    red: '#AA0000',
}

export const error = {
    warning: '#FDE30B',
    main: '#B85300',
    secondary: '#F9E0E0',
    light: '#FEF7B6',
}

export const background = {
    main: '#F7F7F7',
    light: '#FFFFFF',
    dark: '#FAFAFA',
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
    },
    palette: {
        primary: primary,
        secondary: secondary,
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
