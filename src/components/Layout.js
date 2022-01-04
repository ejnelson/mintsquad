import { useMemo, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import {
    IconButton,
    Typography,
    CssBaseline,
    Toolbar,
    AppBar as MuiAppBar,
    Box,
    SvgIcon,
    Menu,
    MenuItem,
} from '@mui/material'
import { Twitter } from '@mui/icons-material'
import { Restricted } from './Restricted'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'

const drawerWidth = 240

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    backgroundImage: 'linear-gradient(to right, #6b21a8 , #38bdf8)',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

export const Layout = () => {
    const theme = useTheme()
    const { wallet, disconnect, disconnecting } = useWallet()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleDisconnect = () => {
        disconnect()
        setAnchorEl(null)
    }
    console.log('wallet', wallet)
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar theme={theme}>
                <Toolbar>
                    <Typography variant="h1" noWrap component="div">
                        🔮 MINT SQUAD
                    </Typography>

                    <IconButton
                        variant="contained"
                        target="_blank"
                        color="inherit"
                        aria-label="twitter"
                        href="https://twitter.com/DegenDAOO"
                        sx={{
                            marginLeft: 'auto',
                            '&:hover': {
                                opacity: 0.4,
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        <Twitter />
                    </IconButton>
                    <IconButton
                        variant="contained"
                        target="_blank"
                        color="inherit"
                        aria-label="discord"
                        href="https://discord.com/invite/SU7KFBu3Us"
                        sx={{
                            '&:hover': {
                                opacity: 0.4,
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        <SvgIcon>
                            <path
                                fill="currentColor"
                                d="M22,24L16.75,19L17.38,21H4.5A2.5,2.5 0 0,1 2,18.5V3.5A2.5,2.5 0 0,1 4.5,1H19.5A2.5,2.5 0 0,1 22,3.5V24M12,6.8C9.32,6.8 7.44,7.95 7.44,7.95C8.47,7.03 10.27,6.5 10.27,6.5L10.1,6.33C8.41,6.36 6.88,7.53 6.88,7.53C5.16,11.12 5.27,14.22 5.27,14.22C6.67,16.03 8.75,15.9 8.75,15.9L9.46,15C8.21,14.73 7.42,13.62 7.42,13.62C7.42,13.62 9.3,14.9 12,14.9C14.7,14.9 16.58,13.62 16.58,13.62C16.58,13.62 15.79,14.73 14.54,15L15.25,15.9C15.25,15.9 17.33,16.03 18.73,14.22C18.73,14.22 18.84,11.12 17.12,7.53C17.12,7.53 15.59,6.36 13.9,6.33L13.73,6.5C13.73,6.5 15.53,7.03 16.56,7.95C16.56,7.95 14.68,6.8 12,6.8M9.93,10.59C10.58,10.59 11.11,11.16 11.1,11.86C11.1,12.55 10.58,13.13 9.93,13.13C9.29,13.13 8.77,12.55 8.77,11.86C8.77,11.16 9.28,10.59 9.93,10.59M14.1,10.59C14.75,10.59 15.27,11.16 15.27,11.86C15.27,12.55 14.75,13.13 14.1,13.13C13.46,13.13 12.94,12.55 12.94,11.86C12.94,11.16 13.45,10.59 14.1,10.59Z"
                            />
                        </SvgIcon>
                    </IconButton>
                    {wallet && (
                        <>
                            <IconButton
                                variant="contained"
                                target="_blank"
                                color="inherit"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                sx={{
                                    '&:hover': {
                                        opacity: 0.4,
                                        backgroundColor: 'transparent',
                                    },
                                    height: '40px',
                                    width: '40px',
                                }}
                            >
                                <img
                                    src={wallet.icon}
                                    alt="wallet icon"
                                    style={{ height: '24px', width: '24px' }}
                                />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleDisconnect}>
                                    Disconnect
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1 }}>
                <DrawerHeader />
                <Restricted />
            </Box>
        </Box>
    )
}
