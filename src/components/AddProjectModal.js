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
    Checkbox,
    Paper,
    FormControlLabel,
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
import { postToDiscord } from '../services/postToDiscord'
import { getTwitterIcon } from '../services/getTwitterIcon'

const initialState = {
    name: '',
    price: '',
    supply: '',
    discord: '',
    twitter: '',
    overview: '',
    website: '',
    whiteListForm: '',
    mintDate: format(new Date(), "yyyy-MM-dd'T'H:mm:ss") + 'Z',
}

export const AddProjectModal = ({
    activeProjectKey,
    onCloseModal,
    isModalOpen,
    projectToEdit,
}) => {
    const [values, setValues] = useState(initialState)
    const [isPostingToDiscord, setIsPostingToDiscord] = useState(true)

    useEffect(() => {
        if (projectToEdit) {
            setValues(projectToEdit)
        }
    }, [projectToEdit])
    const handleSendDiscordHook = async () => {
        const response = await postToDiscord(values)
    }

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
    const handleSave = async () => {
        const twitterIcon = await getTwitterIcon(values.twitter)
        if (projectToEdit) {
            set(ref(getDatabase(), activeProjectKey), {
                ...values,
                twitterIcon,
            })
        } else {
            push(ref(getDatabase()), {
                ...values,
                mintDate: values.mintDate.toString(),
                twitterIcon,
            }).then((db) => {
                get(db).then((snapshot) => {
                    setValues(initialState)
                })
            })
            isPostingToDiscord && handleSendDiscordHook()
        }
        setValues(initialState)
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
                        label="Discord Invite Link (with https://)"
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <TextField
                        label="Website (with https://)"
                        placeholder=""
                        margin="normal"
                        sx={{ marginRight: '16px', flexGrow: '1' }}
                        variant="outlined"
                        value={values.website}
                        onChange={handleChange('website')}
                    />
                    <TextField
                        label="Whitelist form link (with https://)"
                        placeholder=""
                        margin="normal"
                        sx={{ flexGrow: '1' }}
                        variant="outlined"
                        value={values.whiteListForm}
                        onChange={handleChange('whiteListForm')}
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <TextField
                        label="Your discord handle"
                        placeholder=""
                        margin="normal"
                        sx={{ marginRight: '16px' }}
                        variant="outlined"
                        value={values.squadLeader}
                        onChange={handleChange('squadLeader')}
                    />
                    <FormControlLabel
                        label="Post project to discord"
                        control={
                            <Checkbox
                                checked={isPostingToDiscord}
                                onChange={(event) =>
                                    setIsPostingToDiscord(event.target.checked)
                                }
                            />
                        }
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleCancel}>Cancel</Button>

                    <Button onClick={handleSave}>Save</Button>
                </Box>
            </Box>
        </Modal>
    )
}
