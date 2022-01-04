import {
    ref,
    getDatabase,
    set,
    onValue,
    get,
    child,
    remove,
    push,
} from 'firebase/database'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'
import { useList, useObject } from 'react-firebase-hooks/database'
import { useState } from 'react'

import { styled, useTheme } from '@mui/material/styles'
import {
    Avatar,
    Box,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Button,
} from '@mui/material'
import {
    InboxIcon,
    MailIcon,
    TwitterIcon,
    ArrowForwardOutlined,
    ArrowBackOutlined,
    AddCircleOutlined,
} from '@mui/icons-material'
import { Restricted } from './Restricted'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBklylM4QBZ-ojEendzvCok-gMmWphxsxA',
    authDomain: 'mintsquad-73744.firebaseapp.com',
    databaseURL: 'https://mintsquad-73744-default-rtdb.firebaseio.com',
    projectId: 'mintsquad-73744',
    storageBucket: 'mintsquad-73744.appspot.com',
    messagingSenderId: '232717445616',
    appId: '1:232717445616:web:fb94bad08a20e7d0181535',
    measurementId: 'G-DEV1VWL13L',
}

const drawerWidth = 240

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
})

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}))

export const MintSquad = ({ editAccess }) => {
    const [isEditing, setIsEditing] = useState(null)
    const [edits, setEdits] = useState({})
    const theme = useTheme()
    const [open, setOpen] = useState(false)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const analytics = getAnalytics(app)
    const dbRef = ref(getDatabase(app))

    const [snapshots, loading, error] = useObject(dbRef)
    !loading && console.log('snapshots', snapshots.val())
    // console.log('snapshot', snapshot)
    const handleEdit = (key) => {
        setEdits({
            name: snapshots.val()[key].name,
            price: snapshots.val()[key].price,
            supply: snapshots.val()[key].supply,
            discord: snapshots.val()[key].discord,
            twitter: snapshots.val()[key].twitter,
            overview: snapshots.val()[key].overview,
        })
        setIsEditing(key)
    }
    const handleSave = (key) => {
        set(ref(getDatabase(), key), edits)
        setIsEditing(null)
    }
    const handleDelete = (key) => {
        remove(ref(getDatabase(), key))
    }
    const handleAddProject = () => {
        push(ref(getDatabase()), {
            name: '',
            price: '',
            supply: '',
            discord: '',
            twitter: '',
            overview: '',
        }).then((db) => {
            console.log('ds', db)
            get(db).then((snapshot) => {
                console.log('yo', snapshot.key)
                console.log('snapshot', snapshot.val())
                setEdits({
                    name: '',
                    price: '',
                    supply: '',
                    discord: '',
                    twitter: '',
                    overview: '',
                })
                setIsEditing(snapshot.key)
            })
        })
    }
    console.log('editing', isEditing)
    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader />

                <List>
                    {editAccess && (
                        <>
                            <ListItem button onClick={handleAddProject}>
                                <ListItemIcon>
                                    <AddCircleOutlined
                                        sx={{
                                            height: '40px',
                                            width: '40px',
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Add Project" />
                            </ListItem>
                            <Divider />
                        </>
                    )}
                    {['monkeys', 'apes', 'dragons'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                <Avatar
                                    alt="project name"
                                    src="https://unavatar.io/twitter/jack"
                                />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    sx={{
                        marginTop: 'auto',
                        marginLeft: 'auto',
                        marginRight: '16px',
                        marginBottom: '8px',
                        ...(open && { display: 'none' }),
                    }}
                >
                    <ArrowForwardOutlined />
                </IconButton>
                <IconButton
                    onClick={handleDrawerClose}
                    sx={{
                        marginLeft: 'auto',
                        marginTop: 'auto',
                        marginBottom: '8px',
                        marginRight: '16px',
                        ...(!open && { display: 'none' }),
                    }}
                >
                    <ArrowBackOutlined />
                </IconButton>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {!loading &&
                    snapshots.val() &&
                    Object.keys(snapshots.val()).map((key, i) => {
                        const disabled = isEditing !== key
                        const values = disabled ? snapshots.val()[key] : edits
                        return (
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1, width: '25ch' },
                                }}
                                noValidate
                                autoComplete="off"
                                key={i}
                            >
                                <TextField
                                    id="Name"
                                    label="Name"
                                    variant="outlined"
                                    value={values.name}
                                    disabled={disabled}
                                    onChange={(event) =>
                                        setEdits({
                                            ...edits,
                                            name: event.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="Price"
                                    label="Price"
                                    variant="outlined"
                                    value={values.price}
                                    disabled={disabled}
                                    onChange={(event) =>
                                        setEdits({
                                            ...edits,
                                            price: event.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="supply"
                                    label="supply"
                                    variant="outlined"
                                    value={values.supply}
                                    disabled={disabled}
                                    onChange={(event) =>
                                        setEdits({
                                            ...edits,
                                            supply: event.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="Discord"
                                    label="Discord"
                                    variant="outlined"
                                    value={values.discord}
                                    disabled={disabled}
                                    onChange={(event) =>
                                        setEdits({
                                            ...edits,
                                            discord: event.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="Twitter"
                                    label="Twitter"
                                    variant="outlined"
                                    value={values.twitter}
                                    disabled={disabled}
                                    onChange={(event) =>
                                        setEdits({
                                            ...edits,
                                            twitter: event.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    id="Overview"
                                    label="Overview"
                                    variant="outlined"
                                    value={values.overview}
                                    disabled={disabled}
                                    onChange={(event) =>
                                        setEdits({
                                            ...edits,
                                            overview: event.target.value,
                                        })
                                    }
                                />
                                {editAccess && (
                                    <>
                                        {disabled ? (
                                            <Button
                                                onClick={() => handleEdit(key)}
                                                variant="contained"
                                            >
                                                Edit
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleSave(key)}
                                                variant="contained"
                                            >
                                                Save
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleDelete(key)}
                                            variant="contained"
                                        >
                                            Delete Project
                                        </Button>
                                    </>
                                )}
                            </Box>
                        )
                    })}
            </Box>
        </Box>
    )
}
