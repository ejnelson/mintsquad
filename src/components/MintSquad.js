import { ref, getDatabase, set, get, remove, push } from 'firebase/database'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { useObject } from 'react-firebase-hooks/database'
import { useState } from 'react'

import { styled, useTheme } from '@mui/material/styles'
import {
    Avatar,
    Box,
    Drawer as MuiDrawer,
    List,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    Paper,
} from '@mui/material'
import {
    ArrowForwardOutlined,
    ArrowBackOutlined,
    AddCircleOutlined,
} from '@mui/icons-material'
import { AddProjectModal } from './AddProjectModal'
import { ProjectDescription } from './ProjectDescription'
import { parse, parseISO, compareAsc } from 'date-fns'
import { format } from 'date-fns-tz'

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

export const MintSquad = ({
    hasEditAccess,
    walletId,
    isSuggestMints = false,
}) => {
    const [activeProjectKey, setActiveProjectKey] = useState(null)
    const theme = useTheme()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [projectToEdit, setProjectToEdit] = useState(null)

    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    // const analytics = getAnalytics(app)
    const dbRef = ref(getDatabase(app))
    const [snapshots, loading, error] = useObject(dbRef)
    const activeData =
        snapshots && !loading && activeProjectKey
            ? snapshots.val()[activeProjectKey]
            : null

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

    const handleArchive = (postMintFloorPrice) => {
        set(
            ref(getDatabase(), activeProjectKey + `/floorPricePostMint/`),
            postMintFloorPrice
        )
        set(ref(getDatabase(), activeProjectKey + `/archived/`), true)
        setActiveProjectKey(null)
    }

    const handleDelete = () => {
        remove(ref(getDatabase(), activeProjectKey))
    }
    const handleEdit = (key) => {
        setIsModalOpen(true)
        setProjectToEdit(activeData)
    }
    const handleApprove = () => {
        set(ref(getDatabase(), activeProjectKey + `/suggested/`), false)
    }

    const handleAddProject = () => {
        setIsModalOpen(true)
    }
    const handleCloseModal = () => {
        setProjectToEdit(null)
        setIsModalOpen(false)
    }

    const handleActivateNewProject = (newProjectKey) => {
        setActiveProjectKey(newProjectKey)
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <AddProjectModal
                projectToEdit={projectToEdit}
                isModalOpen={isModalOpen}
                onCloseModal={handleCloseModal}
                activeProjectKey={activeProjectKey}
                onActivateNewProject={handleActivateNewProject}
                suggested={isSuggestMints}
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
                        Object.keys(snapshots.val())
                            .filter(
                                (key) =>
                                    console.log('key', snapshots.val()[key]) ||
                                    (snapshots.val()[key].archived !== true &&
                                        snapshots.val()[key].suggested ===
                                            isSuggestMints)
                            )
                            .sort((key1, key2) => {
                                return compareAsc(
                                    parse(
                                        snapshots.val()[key1].mintDate,
                                        "yyyy-MM-dd'T'HH:mm:ss'Z'",
                                        new Date()
                                    ),
                                    parse(
                                        snapshots.val()[key2].mintDate,
                                        "yyyy-MM-dd'T'HH:mm:ss'Z'",
                                        new Date()
                                    )
                                )
                            })
                            .map((key, i) => {
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
                                        <ListItemAvatar
                                            alt="project name"
                                            src=""
                                        >
                                            <Avatar
                                                alt={values.name}
                                                src={values.twitterIcon}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ color: 'white' }}
                                            primary={values.name}
                                            secondary={format(
                                                parseISO(
                                                    values.mintDate,
                                                    "yyyy-MM-dd'T'HH:mm:ss'Z",
                                                    new Date()
                                                ),
                                                'MMM dd h:mm a 	zzz'
                                            )}
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
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onApprove={handleApprove}
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
