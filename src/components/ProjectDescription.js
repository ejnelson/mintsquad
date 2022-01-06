import { MintSquad } from './MintSquad'
import { useState, useEffect, useMemo } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletNfts } from '@nfteyez/sol-rayz-react'
import {
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import {
    Box,
    Paper,
    Typography,
    IconButton,
    SvgIcon,
    Chip,
    ListItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
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
} from '@mui/icons-material'
import {
    parseISO,
    parse,
    format,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    differenceInDays,
    formatDistanceToNow,
} from 'date-fns'
import Linkify from 'react-linkify'

export const ProjectDescription = ({
    activeData,
    onUpdateVote,
    onDelete,
    onEdit,
    activeProjectKey,
    hasEditAccess,
}) => {
    const theme = useTheme()
    console.log('activeData', activeData)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [vote, setVote] = useState('')
    const [timer, setTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        onUpdateVote(vote)
    }, [vote, onUpdateVote])
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (
                (((timer.days === timer.minutes) === timer.seconds) ===
                    timer.hours) ===
                0
            ) {
                clearInterval(myInterval)
            } else {
                setTimer(timeUntilMint)
            }
        }, 1000)
        return () => {
            clearInterval(myInterval)
        }
    })

    useEffect(() => {
        setTimer(timeUntilMint)
    }, [activeData.mintTime])

    const handleVote = (event) => {
        if (event.target.value === vote) {
            setVote('')
        } else {
            setVote(event.target.value)
        }
    }
    const handleEdit = () => {
        onEdit(activeProjectKey)
    }
    const handleDelete = () => {
        onDelete(activeProjectKey)
        setIsDialogOpen(false)
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

    console.log('timer', timer)
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
                    <IconButton
                        // variant="contained"
                        target="_blank"
                        aria-label="twitter"
                        href={`https://twitter.com/${activeData.twitter}`}
                        sx={{
                            marginLeft: 'auto',
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
                <Box sx={{ display: 'flex' }}>
                    <Paper
                        elevation={1}
                        sx={{
                            padding: '16px',
                            whiteSpace: 'pre-wrap',
                            flexGrow: 1,
                            marginRight: '12px',
                            backgroundColor: theme.palette.background.main,
                        }}
                    >
                        <Linkify>{activeData.overview}</Linkify>
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
                                            icon={<SentimentNeutralRounded />}
                                        />
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
                {hasEditAccess && (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '8px',
                            }}
                        >
                            {/* <Button
                        variant="contained"
                        onClick={handleEdit}
                        sx={{
                            marginRight: '8px',
                            backgroundColor: theme.palette.background.dark,
                            '&:hover': {
                                backgroundColor: theme.palette.background.light,
                            },
                        }}
                    >
                        Edit
                    </Button> */}
                            <Button
                                variant="contained"
                                onClick={() => setIsDialogOpen(true)}
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
                            open={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
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
                                    This will remove the project from available
                                    projects to view and delete all votes.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleDelete} autoFocus>
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

{
    /* {editAccess && (
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
                                )} */
}
