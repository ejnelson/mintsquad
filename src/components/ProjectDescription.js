import { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    IconButton,
    SvgIcon,
    Chip,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
    Link,
    TextField,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
    Twitter,
    MonetizationOnRounded,
    Numbers,
    AccessTimeFilledRounded,
    SentimentNeutralRounded,
    SentimentVerySatisfiedRounded,
    SentimentVeryDissatisfiedRounded,
    CheckCircleRounded,
    LanguageRounded,
    AccountCircleRounded,
} from '@mui/icons-material'
import {
    parseISO,
    parse,
    format,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    differenceInDays,
} from 'date-fns'
import Linkify from 'react-linkify'

export const ProjectDescription = ({
    activeData,
    onUpdateVote,
    onArchive,
    onDelete,
    onEdit,
    onApprove,

    activeProjectKey,
    hasEditAccess,
    walletId,
}) => {
    const theme = useTheme()
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const [vote, setVote] = useState('')
    const [postMintFloorPrice, setPostMintFloorPrice] = useState('')
    const [timer, setTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    useEffect(() => {
        const vote = Object.keys(activeData?.votes).reduce((acc, key) => {
            let reducerValue = ''
            if (Object.keys(activeData.votes[key]).includes(walletId)) {
                return key
            } else {
                return acc
            }
        }, '')
        setVote(vote)
    }, [activeProjectKey])

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (
                (((timer.days === timer.minutes) === timer.seconds) ===
                    timer.hours) ===
                0
            ) {
                clearInterval(myInterval)
            } else {
                setTimer(timeUntilMint())
            }
        }, 1000)
        return () => {
            clearInterval(myInterval)
        }
    })

    useEffect(() => {
        setTimer(timeUntilMint())
    }, [activeProjectKey])

    const handleVote = (event) => {
        if (event.target.value === vote) {
            setVote('')
            onUpdateVote('')
        } else {
            setVote(event.target.value)
            onUpdateVote(event.target.value)
        }
    }
    const handleEdit = () => {
        onEdit(activeProjectKey)
    }
    const handleArchive = (postFloorMintPrice) => {
        onArchive(postFloorMintPrice)
        setIsArchiveDialogOpen(false)
    }
    const handleDelete = (key) => {
        onDelete()

        setIsDeleteDialogOpen(false)
    }
    const handleApprove = () => {
        onApprove()
    }
    const timeUntilMint = () => {
        const days = differenceInDays(
            parseISO(
                activeData.mintDate,
                "yyyy-MM-dd'T'HH:mm:ss'Z",
                new Date()
            ),
            new Date()
        )
        const hours =
            differenceInHours(
                parseISO(
                    activeData.mintDate,
                    "yyyy-MM-dd'T'HH:mm:ss'Z",
                    new Date()
                ),
                new Date()
            ) -
            days * 24
        const minutes =
            differenceInMinutes(
                parseISO(
                    activeData.mintDate,
                    "yyyy-MM-dd'T'HH:mm:ss'Z'",
                    new Date()
                ),
                new Date()
            ) -
            hours * 60 -
            days * 24 * 60
        const seconds =
            differenceInSeconds(
                parseISO(
                    activeData.mintDate,
                    "yyyy-MM-dd'T'HH:mm:ss'Z'",
                    new Date()
                ),
                new Date()
            ) -
            minutes * 60 -
            hours * 60 * 60 -
            days * 24 * 60 * 60

        return { days, hours, minutes, seconds }
    }
    return (
        <Box>
            <Paper
                elevation={2}
                sx={{
                    padding: '12px',
                    backgroundColor: theme.palette.background.ultraLight,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Typography variant="h2">{activeData.name}</Typography>
                    <Chip
                        icon={<MonetizationOnRounded />}
                        label={activeData.price}
                        sx={{ marginLeft: '8px' }}
                    />
                    <Chip
                        icon={<Numbers />}
                        label={activeData.supply}
                        sx={{ marginLeft: '8px' }}
                    />
                    <Chip
                        icon={<AccessTimeFilledRounded />}
                        label={format(
                            parse(
                                activeData.mintDate,
                                "yyyy-MM-dd'T'HH:mm:ss'Z'",
                                new Date()
                            ),
                            "MMM dd K:mm a 'UTC'"
                        )}
                        sx={{ marginLeft: '8px' }}
                    />
                    <Chip
                        icon={<AccessTimeFilledRounded />}
                        label={`Count down to mint:
                        ${timer.days} : ${timer.hours} : ${timer.minutes} : ${timer.seconds}`}
                        sx={{ marginLeft: '8px' }}
                    />
                    {activeData.squadLeader && (
                        <Chip
                            icon={<AccountCircleRounded />}
                            label={activeData.squadLeader}
                            sx={{ marginLeft: '8px' }}
                        />
                    )}
                    <IconButton
                        // variant="contained"
                        target="_blank"
                        aria-label="website"
                        href={activeData.website}
                        sx={{
                            marginLeft: 'auto',
                            color: theme.palette.primary.dark,
                        }}
                    >
                        <LanguageRounded />
                    </IconButton>
                    <IconButton
                        // variant="contained"
                        target="_blank"
                        aria-label="twitter"
                        href={`https://twitter.com/${activeData.twitter}`}
                        sx={{
                            color: theme.palette.primary.dark,
                        }}
                    >
                        <Twitter />
                    </IconButton>
                    <IconButton
                        // variant="contained"
                        target="_blank"
                        aria-label="discord"
                        href={activeData.discord}
                        sx={{
                            color: theme.palette.primary.dark,
                        }}
                    >
                        <SvgIcon>
                            <path
                                fill="currentColor"
                                d="M22,24L16.75,19L17.38,21H4.5A2.5,2.5 0 0,1 2,18.5V3.5A2.5,2.5 0 0,1 4.5,1H19.5A2.5,2.5 0 0,1 22,3.5V24M12,6.8C9.32,6.8 7.44,7.95 7.44,7.95C8.47,7.03 10.27,6.5 10.27,6.5L10.1,6.33C8.41,6.36 6.88,7.53 6.88,7.53C5.16,11.12 5.27,14.22 5.27,14.22C6.67,16.03 8.75,15.9 8.75,15.9L9.46,15C8.21,14.73 7.42,13.62 7.42,13.62C7.42,13.62 9.3,14.9 12,14.9C14.7,14.9 16.58,13.62 16.58,13.62C16.58,13.62 15.79,14.73 14.54,15L15.25,15.9C15.25,15.9 17.33,16.03 18.73,14.22C18.73,14.22 18.84,11.12 17.12,7.53C17.12,7.53 15.59,6.36 13.9,6.33L13.73,6.5C13.73,6.5 15.53,7.03 16.56,7.95C16.56,7.95 14.68,6.8 12,6.8M9.93,10.59C10.58,10.59 11.11,11.16 11.1,11.86C11.1,12.55 10.58,13.13 9.93,13.13C9.29,13.13 8.77,12.55 8.77,11.86C8.77,11.16 9.28,10.59 9.93,10.59M14.1,10.59C14.75,10.59 15.27,11.16 15.27,11.86C15.27,12.55 14.75,13.13 14.1,13.13C13.46,13.13 12.94,12.55 12.94,11.86C12.94,11.16 13.45,10.59 14.1,10.59Z"
                            />
                        </SvgIcon>
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Paper
                            elevation={1}
                            sx={{
                                padding: '16px',
                                whiteSpace: 'pre-wrap',
                                flexGrow: 1,
                                marginRight: '12px',
                                backgroundColor: theme.palette.background.main,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Linkify>{activeData.overview}</Linkify>
                            {activeData.whiteListForm && (
                                <Box sx={{ marginTop: '8px' }}>
                                    WhiteList:
                                    <Link
                                        href={activeData.whiteListForm}
                                        underline="hover"
                                        sx={{
                                            marginLeft: 'auto',
                                            color: theme.palette.primary.dark,
                                        }}
                                    >
                                        {activeData.whiteListForm}
                                    </Link>
                                </Box>
                            )}
                        </Paper>
                        <Paper
                            elevation={1}
                            sx={{
                                padding: '16px',
                                width: '150px',
                                backgroundColor: theme.palette.background.main,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',

                                '& a:link': {
                                    color: 'green',
                                    backgroundColor: 'transparent',
                                    textDecoration: 'none',
                                },
                            }}
                        >
                            <FormControl component="fieldset">
                                {/* <FormLabel component="legend">Gender</FormLabel> */}
                                <RadioGroup
                                    aria-label="vote"
                                    defaultValue=""
                                    name="radio-buttons-group"
                                    value={vote}
                                >
                                    <FormControlLabel
                                        value="mint"
                                        control={
                                            <Tooltip
                                                title="I will mint this"
                                                placement="left"
                                            >
                                                <Radio
                                                    onClick={handleVote}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 48,
                                                        },
                                                        '&:hover': {
                                                            // bgcolor: 'transparent',
                                                        },
                                                    }}
                                                    checkedIcon={
                                                        <SentimentVerySatisfiedRounded
                                                            sx={{
                                                                color: 'limegreen',
                                                            }}
                                                        />
                                                    }
                                                    icon={
                                                        <SentimentVerySatisfiedRounded />
                                                    }
                                                />
                                            </Tooltip>
                                        }
                                        label={
                                            Object.keys(
                                                activeData?.votes?.mint || {}
                                            ).length
                                        }
                                    />
                                    <FormControlLabel
                                        value="pass"
                                        control={
                                            <Tooltip
                                                title="I'm indifferent/won't mint"
                                                placement="left"
                                            >
                                                <Radio
                                                    onClick={handleVote}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 48,
                                                        },
                                                        '&:hover': {
                                                            // bgcolor: 'transparent',
                                                        },
                                                    }}
                                                    checkedIcon={
                                                        <SentimentNeutralRounded
                                                            sx={{
                                                                color: 'gold',
                                                            }}
                                                        />
                                                    }
                                                    icon={
                                                        <SentimentNeutralRounded />
                                                    }
                                                />
                                            </Tooltip>
                                        }
                                        label={
                                            Object.keys(
                                                activeData?.votes?.pass || {}
                                            ).length
                                        }
                                    />
                                    <FormControlLabel
                                        value="rug"
                                        control={
                                            <Tooltip
                                                title="This might be a rug"
                                                placement="left"
                                            >
                                                <Radio
                                                    onClick={handleVote}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 48,
                                                        },
                                                        '&:hover': {
                                                            // bgcolor: 'transparent',
                                                        },
                                                    }}
                                                    checkedIcon={
                                                        <SentimentVeryDissatisfiedRounded
                                                            sx={{
                                                                color: 'red',
                                                            }}
                                                        />
                                                    }
                                                    icon={
                                                        <SentimentVeryDissatisfiedRounded />
                                                    }
                                                />
                                            </Tooltip>
                                        }
                                        label={
                                            Object.keys(
                                                activeData?.votes?.rug || {}
                                            ).length
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Box>
                    {Object.values(activeData?.images || {}).length > 0 && (
                        <Paper
                            elevation={1}
                            sx={{
                                // padding: '16px',
                                // width: '150px',
                                backgroundColor: theme.palette.background.main,
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                marginTop: '16px',
                                padding: '8px',
                                flexWrap: 'wrap',
                            }}
                        >
                            {Object.values(activeData.images).map(
                                (image, index) => {
                                    return (
                                        <Box key={index}>
                                            <img
                                                src={image}
                                                alt={`number ${index}`}
                                                style={{
                                                    width: 'auto',
                                                    maxHeight: '200px',
                                                    margin: '8px',
                                                }}
                                            />
                                        </Box>
                                    )
                                }
                            )}
                        </Paper>
                    )}
                </Box>
                {hasEditAccess && (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '8px',
                            }}
                        >
                            {activeData.suggested && (
                                <Button
                                    variant="contained"
                                    onClick={handleApprove}
                                    sx={{
                                        marginRight: '8px',
                                        backgroundColor:
                                            theme.palette.background.dark,
                                        '&:hover': {
                                            backgroundColor:
                                                theme.palette.background.light,
                                        },
                                    }}
                                >
                                    Approve Suggested Project
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                onClick={handleEdit}
                                sx={{
                                    marginRight: '8px',
                                    backgroundColor:
                                        theme.palette.background.dark,
                                    '&:hover': {
                                        backgroundColor:
                                            theme.palette.background.light,
                                    },
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setIsArchiveDialogOpen(true)}
                                sx={{
                                    backgroundColor:
                                        theme.palette.background.dark,
                                    marginRight: '8px',

                                    '&:hover': {
                                        backgroundColor:
                                            theme.palette.background.light,
                                    },
                                }}
                            >
                                Archive
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setIsDeleteDialogOpen(true)}
                                sx={{
                                    backgroundColor:
                                        theme.palette.background.dark,
                                    '&:hover': {
                                        backgroundColor:
                                            theme.palette.background.light,
                                    },
                                }}
                            >
                                Delete
                            </Button>
                        </Box>

                        <Dialog
                            open={isArchiveDialogOpen}
                            onClose={() => setIsArchiveDialogOpen(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {
                                    'Are you sure you want to archive this project?'
                                }
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    The project will be removed from the project
                                    list, but the project data will be saved and
                                    available at a later time.
                                </DialogContentText>
                            </DialogContent>
                            <TextField
                                label="Floor price 1 hour post mint"
                                placeholder=""
                                margin="normal"
                                sx={{
                                    marginLeft: 'auto',
                                    marginRight: '16px',
                                    width: '300px',
                                }}
                                variant="outlined"
                                value={postMintFloorPrice}
                                onChange={(event) =>
                                    setPostMintFloorPrice(event.target.value)
                                }
                            />
                            <DialogActions>
                                <Button
                                    onClick={() =>
                                        setIsArchiveDialogOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleArchive(postMintFloorPrice)
                                    }
                                    autoFocus
                                >
                                    Confirm
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={isDeleteDialogOpen}
                            onClose={() => setIsDeleteDialogOpen(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {
                                    'Are you sure you want to delete this project?'
                                }
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    The project will deleted and all votes/data
                                    will be lost.
                                </DialogContentText>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleDelete()}
                                    autoFocus
                                >
                                    Confirm
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Paper>
        </Box>
    )
}
