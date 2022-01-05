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
import { useState, useEffect } from 'react'

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
    ListItemAvatar,
    Modal,
    ListItemButton,
} from '@mui/material'
import {
    InboxIcon,
    MailIcon,
    TwitterIcon,
    ArrowForwardOutlined,
    ArrowBackOutlined,
    AddCircleOutlined,
} from '@mui/icons-material'
import { DateTimePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

import { Restricted } from './Restricted'
import axios from 'axios'
import { ProjectDescription } from './ProjectDescription'
import { parseISO, parse } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'
// const bearerToken =
//     'AAAAAAAAAAAAAAAAAAAAAEgUXwEAAAAAlIXafDptLJqlcS3iqiIsRktthbw%3DLS3KKCTirevHGkD0kW7jQjpeItp93rJjrXxwZNsAHWCNl6fEw6'

const herokuProxy = 'https://enigmatic-headland-40206.herokuapp.com/'

// import { Client } from 'twitter.js'
// // import { bearerToken } from './secrets.js';

// const client = new Client()
// client.on('ready', async () => {
//     const user = await client.users.fetchByUsername({
//         username: 'ejnelson',
//     })
//     console.log(user.description) // Contributing to open-source 🌐
// })

// client.loginWithBearerToken(bearerToken)

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
    backgroundColor: theme.palette.background.light,

    overflowX: 'hidden',
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.background.light,
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
    backgroundColor: 'red',

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
    const [twitterPics, setTwitterPics] = useState({})
    const [activeProjectKey, setActiveProjectKey] = useState(null)
    const theme = useTheme()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const api = 'https://api.twitter.com/2/users/by/username/'
    const config = {
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TWITTER_BEARER_TOKEN}`,
        },
        params: {
            'user.fields': 'profile_image_url',
        },
    }

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
    useEffect(() => {
        const getTwitterPics = async () => {
            const promises = Object.keys(snapshots.val()).map(
                async (key, i) => {
                    const values = snapshots.val()[key]
                    return axios.get(herokuProxy + api + values.twitter, config)
                }
            )
            await Promise.all(promises).then((res) => {
                let twitterPicObject = {}
                Object.keys(snapshots.val()).forEach((key, i) => {
                    twitterPicObject[key] =
                        res[i].data.data?.profile_image_url || null
                })
                setTwitterPics(twitterPicObject)
            })
        }
        !loading && snapshots.val() && getTwitterPics()
    }, [loading, snapshots])

    const handleSave = (key) => {
        set(ref(getDatabase(), key), edits)
        setIsEditing(null)
    }
    const handleDelete = (key) => {
        remove(ref(getDatabase(), key))
    }
    const handleAddProject = () => {
        setIsModalOpen(true)
        // push(ref(getDatabase()), {
        //     name: '',
        //     price: '',
        //     supply: '',
        //     discord: '',
        //     twitter: '',
        //     overview: '',
        // }).then((db) => {
        //     console.log('ds', db)
        //     get(db).then((snapshot) => {
        //         console.log('yo', snapshot.key)
        //         console.log('snapshot', snapshot.val())
        //         setEdits({
        //             name: '',
        //             price: '',
        //             supply: '',
        //             discord: '',
        //             twitter: '',
        //             overview: '',
        //         })
        //         setIsEditing(snapshot.key)
        //     })
        // })
    }
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }
    const activeData = snapshots ? snapshots.val()[activeProjectKey] : null

    return (
        <Box sx={{ display: 'flex' }}>
            <AddProjectModal
                isModalOpen={isModalOpen}
                onCloseModal={handleCloseModal}
            />

            <Drawer variant="permanent" open={open}>
                <DrawerHeader />

                <List>
                    {editAccess && (
                        <>
                            <ListItemButton onClick={handleAddProject}>
                                <ListItemIcon>
                                    <AddCircleOutlined
                                        sx={{
                                            height: '40px',
                                            width: '40px',
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Add Project" />
                            </ListItemButton>
                            <Divider />
                        </>
                    )}
                    {!loading &&
                        snapshots.val() &&
                        Object.keys(snapshots.val()).map((key, i) => {
                            const values = snapshots.val()[key]
                            return (
                                <ListItemButton
                                    key={i}
                                    onClick={() => setActiveProjectKey(key)}
                                    selected={key === activeProjectKey}
                                >
                                    <ListItemAvatar alt="project name" src="">
                                        <Avatar
                                            alt="Project"
                                            src={twitterPics[key]}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={values.name} />
                                </ListItemButton>
                            )
                        })}
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
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    // backgroundColor: theme.palette.background.main,
                }}
            >
                {!loading && activeData && (
                    <ProjectDescription activeData={activeData} />
                )}
            </Box>
        </Box>
    )
}

const initialState = {
    name: '',
    price: '',
    supply: '',
    discord: '',
    twitter: '',
    overview: '',
    mintDate: format(new Date(), "yyyy-MM-dd'T'H:mm:ss") + 'Z',
}
const AddProjectModal = ({ onCloseModal, isModalOpen }) => {
    const [values, setValues] = useState(initialState)
    console.log('vaule', values)

    const handleChange = (key) => (input) => {
        if (key === 'mintDate') {
            console.log('input', input)
            const dateAsUtc = format(input, "yyyy-MM-dd'T'HH:mm:ss") + 'Z'

            setValues({ ...values, [key]: dateAsUtc })
        } else {
            setValues({ ...values, [key]: input.target.value })
        }
    }
    const handleCancel = () => {
        setValues({})
        onCloseModal()
    }
    const handleSave = () => {
        push(ref(getDatabase()), {
            ...values,
            mintDate: values.mintDate.toString(),
        }).then((db) => {
            console.log('ds', db)
            get(db).then((snapshot) => {
                console.log('yo', snapshot.key)
                console.log('snapshot', snapshot.val())
                setValues(initialState)
            })
        })
        onCloseModal()
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }
    console.log(
        'mint date',
        parse(values.mintDate, "yyyy-MM-dd'T'HH:mm:ss'Z'", new Date())
    )
    return (
        <Modal
            open={isModalOpen}
            onClose={onCloseModal}
            aria-labelledby="add project modal"
        >
            <Box sx={style} component="form">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Project
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                        label="Project Name"
                        margin="normal"
                        variant="outlined"
                        value={values.name}
                        onChange={handleChange('name')}
                        sx={{ flexGrow: '1', marginRight: '16px' }}
                        autoFocus
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Mint Date and Time"
                            value={parse(
                                values.mintDate,
                                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                                new Date()
                            )}
                            onChange={handleChange('mintDate')}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <TextField
                        label="Price in Sol"
                        placeholder="1"
                        margin="normal"
                        sx={{ marginRight: '16px', flexGrow: '1' }}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        variant="outlined"
                        value={values.price}
                        onChange={handleChange('price')}
                    />
                    <TextField
                        label="Supply"
                        placeholder="1"
                        margin="normal"
                        sx={{ flexGrow: '1' }}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        variant="outlined"
                        value={values.supply}
                        onChange={handleChange('supply')}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <TextField
                        label="Discord Invite Link"
                        placeholder="1"
                        margin="normal"
                        sx={{ marginRight: '16px', flexGrow: '1' }}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        variant="outlined"
                        value={values.discord}
                        onChange={handleChange('discord')}
                    />
                    <TextField
                        label="Twitter Handle (without @)"
                        placeholder="1"
                        margin="normal"
                        sx={{ flexGrow: '1' }}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        variant="outlined"
                        value={values.twitter}
                        onChange={handleChange('twitter')}
                    />
                </Box>
                <TextField
                    label="Project Overview/Notes"
                    variant="outlined"
                    value={values.overview}
                    onChange={handleChange('overview')}
                    rows={7}
                    margin="normal"
                    fullWidth
                    multiline
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleCancel}>Cancel</Button>

                    <Button onClick={handleSave}>Save</Button>
                </Box>
            </Box>
        </Modal>
    )
}
