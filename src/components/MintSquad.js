import { ref, getDatabase, set, get, remove, push } from 'firebase/database'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { useObject } from 'react-firebase-hooks/database'
import { useState, useEffect } from 'react'

import { styled, useTheme } from '@mui/material/styles'
import {
    Avatar,
    Box,
    Drawer as MuiDrawer,
    List,
    Typography,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Button,
    ListItemAvatar,
    Modal,
    ListItemButton,
    Paper,
} from '@mui/material'
import {
    ArrowForwardOutlined,
    ArrowBackOutlined,
    AddCircleOutlined,
} from '@mui/icons-material'
import { DateTimePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

import axios from 'axios'
import { ProjectDescription } from './ProjectDescription'
import { parse } from 'date-fns'
import { format } from 'date-fns-tz'

const herokuProxy = 'https://enigmatic-headland-40206.herokuapp.com/'
const api = 'https://api.twitter.com/2/users/by/username/'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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

export const MintSquad = ({ hasEditAccess, walletId }) => {
    const [twitterPics, setTwitterPics] = useState({})
    const [activeProjectKey, setActiveProjectKey] = useState(null)
    const theme = useTheme()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [open, setOpen] = useState(false)
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    // const analytics = getAnalytics(app)
    const dbRef = ref(getDatabase(app))
    const [snapshots, loading, error] = useObject(dbRef)
    const activeData =
        snapshots && !loading && activeProjectKey
            ? snapshots.val()[activeProjectKey]
            : null
    console.log('refrewsh', Object.keys(snapshots?.val() || {}).length)
    useEffect(() => {
        const getTwitterPics = async () => {
            console.log('getting twitter pics')
            const promises = Object.keys(snapshots.val()).map(
                async (key, i) => {
                    const values = snapshots.val()[key]
                    const {
                        data: { access_token },
                    } = await axios.post(
                        herokuProxy +
                            'https://api.twitter.com/oauth2/token?grant_type=client_credentials',
                        {},
                        {
                            auth: {
                                username: process.env.REACT_APP_TWITTER_API_KEY,
                                password:
                                    process.env
                                        .REACT_APP_TWITTER_API_KEY_SECRET,
                            },
                        }
                    )
                    return axios.get(herokuProxy + api + values.twitter, {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        params: {
                            'user.fields': 'profile_image_url',
                        },
                    })
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
    }, [Object.keys(snapshots?.val() || {}).length])

    const handleUpdateVote = (vote) => {
        const voteOptions = ['mint', 'pass', 'rug']
        // dbRef.transaction((currentValue) => {
        //     console.log('currentValue', currentValue)
        // })
        voteOptions.forEach((option) => {
            if (option === vote) {
                set(
                    ref(
                        getDatabase(),
                        activeProjectKey + `/votes/${option}/${walletId}`
                    ),
                    true
                )
            } else {
                remove(
                    ref(
                        getDatabase(),
                        activeProjectKey + `/votes/${option}/${walletId}`
                    )
                )
            }
        })
    }
    // const handleSave = (key) => {
    //     set(ref(getDatabase(), key), edits)
    // }
    const handleDelete = (key) => {
        console.log('key', key)
        remove(ref(getDatabase(), key))
    }
    const handleEdit = (key) => {}

    const handleAddProject = () => {
        setIsModalOpen(true)
    }
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <AddProjectModal
                isModalOpen={isModalOpen}
                onCloseModal={handleCloseModal}
            />

            <Drawer variant="permanent" open={open}>
                <DrawerHeader />

                <List>
                    {hasEditAccess && (
                        <>
                            <ListItemButton onClick={handleAddProject}>
                                <ListItemIcon>
                                    <AddCircleOutlined
                                        sx={{
                                            height: '40px',
                                            width: '40px',
                                            color: 'white',
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{ color: 'white' }}
                                    primary="Add Project"
                                />
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
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor:
                                                theme.palette.background
                                                    .mediumDark,
                                        },
                                    }}
                                >
                                    <ListItemAvatar alt="project name" src="">
                                        <Avatar
                                            alt="Project"
                                            src={twitterPics[key]}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{ color: 'white' }}
                                        primary={values.name}
                                    />
                                </ListItemButton>
                            )
                        })}
                </List>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => {
                        setOpen(true)
                    }}
                    sx={{
                        marginTop: 'auto',
                        marginLeft: 'auto',
                        marginRight: '16px',
                        marginBottom: '8px',
                        color: 'white',
                        ...(open && { display: 'none' }),
                    }}
                >
                    <ArrowForwardOutlined />
                </IconButton>
                <IconButton
                    onClick={() => {
                        setOpen(false)
                    }}
                    sx={{
                        marginLeft: 'auto',
                        marginTop: 'auto',
                        marginBottom: '8px',
                        marginRight: '16px',
                        color: 'white',
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
                {!loading && activeData ? (
                    <ProjectDescription
                        activeData={activeData}
                        onUpdateVote={handleUpdateVote}
                        activeProjectKey={activeProjectKey}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        hasEditAccess={hasEditAccess}
                        walletId={walletId}
                    />
                ) : (
                    <Box
                        sx={{
                            height: '80vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Paper
                            elevation={5}
                            sx={{
                                padding: '30px',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '90px',
                                    marginBottom: '-25px',
                                    marginTop: '-20px',
                                }}
                            >
                                🔮
                            </p>
                            <p style={{ fontSize: '20px' }}>
                                Select a project to get started
                            </p>
                        </Paper>
                    </Box>
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

    const handleChange = (key) => (input) => {
        if (key === 'mintDate') {
            const dateAsUtc = format(input, "yyyy-MM-dd'T'HH:mm:ss") + 'Z'

            setValues({ ...values, [key]: dateAsUtc })
        } else {
            setValues({ ...values, [key]: input.target.value })
        }
    }
    const handleCancel = () => {
        setValues(initialState)
        onCloseModal()
    }
    const handleSave = () => {
        push(ref(getDatabase()), {
            ...values,
            mintDate: values.mintDate.toString(),
        }).then((db) => {
            get(db).then((snapshot) => {
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
                        placeholder=""
                        margin="normal"
                        sx={{ marginRight: '16px', flexGrow: '1' }}
                        variant="outlined"
                        value={values.price}
                        onChange={handleChange('price')}
                    />
                    <TextField
                        label="Supply"
                        placeholder=""
                        margin="normal"
                        sx={{ flexGrow: '1' }}
                        variant="outlined"
                        value={values.supply}
                        onChange={handleChange('supply')}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <TextField
                        label="Discord Invite Link"
                        placeholder=""
                        margin="normal"
                        sx={{ marginRight: '16px', flexGrow: '1' }}
                        variant="outlined"
                        value={values.discord}
                        onChange={handleChange('discord')}
                    />
                    <TextField
                        label="Twitter Handle (without @)"
                        placeholder=""
                        margin="normal"
                        sx={{ flexGrow: '1' }}
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
