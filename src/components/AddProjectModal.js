import { ref, getDatabase, set, get, push } from 'firebase/database'
// Import the functions you need from the SDKs you need
import { useState, useEffect } from 'react'

import {
    Box,
    Typography,
    TextField,
    Button,
    Modal,
    Checkbox,
    FormControlLabel,
    IconButton,
    Tooltip,
} from '@mui/material'
import { Save, AddCircleOutlined } from '@mui/icons-material'
import { DateTimePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LoadingButton from '@mui/lab/LoadingButton'
import { parse } from 'date-fns'
import { format } from 'date-fns-tz'
import { postToDiscord } from '../services/postToDiscord'
import { getTwitterIcon } from '../services/getTwitterIcon'
import { cloneDeep } from 'lodash'

const initialState = {
    name: '',
    price: '',
    supply: '',
    discord: '',
    twitter: '',
    overview: '',
    website: '',
    whiteListForm: '',
    squadLeader: '',
    images: [''],
    mintDate: format(new Date(), "yyyy-MM-dd'T'H:mm:ss") + 'Z',
}

export const AddProjectModal = ({
    activeProjectKey,
    onCloseModal,
    isModalOpen,
    projectToEdit,
    onActivateNewProject,
    suggested = false,
}) => {
    const [values, setValues] = useState(initialState)
    const [numberOfImages, setNumberOfImages] = useState(1)

    const [isPostingToDiscord, setIsPostingToDiscord] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    useEffect(() => {
        if (projectToEdit) {
            setValues({
                ...projectToEdit,
                images: projectToEdit.images || [],
            })
            setNumberOfImages(projectToEdit.images?.length || 1)
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
        setNumberOfImages(1)
        onCloseModal()
    }
    const handleSave = async () => {
        setIsSaving(true)
        let twitterIcon = null
        try {
            twitterIcon = await getTwitterIcon(values.twitter)
        } catch (e) {
            setIsSaving(false)
        }
        if (projectToEdit) {
            set(ref(getDatabase(), activeProjectKey), {
                ...values,
                twitterIcon,
                suggested,
            })
        } else {
            push(ref(getDatabase()), {
                ...values,
                mintDate: values.mintDate.toString(),
                twitterIcon,
                votes: '',
                suggested,
            }).then((db) => {
                get(db).then((snapshot) => {
                    onActivateNewProject(snapshot.key)
                    setValues(initialState)
                })
            })
            isPostingToDiscord && handleSendDiscordHook()
        }
        setValues(initialState)
        setNumberOfImages(1)
        onCloseModal()
        setIsSaving(false)
    }

    const handleAddImage = () => {
        setNumberOfImages(numberOfImages + 1)
    }
    const handleChangeImage = (index) => (input) => {
        const newImages = cloneDeep(values.images)
        newImages[index] = input.target.value
        setValues({ ...values, images: newImages })
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
        maxHeight: '90vh',
        overflow: 'auto',
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
                    {suggested ? 'Suggest Project' : 'Add Project'}
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
                {[...Array(numberOfImages)].map((_, i) => {
                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            key={i}
                        >
                            <TextField
                                label="Image Url"
                                placeholder=""
                                margin="normal"
                                sx={{
                                    marginRight: '16px',
                                    flexGrow: '1',
                                }}
                                variant="outlined"
                                value={values.images[i] || ''}
                                onChange={handleChangeImage(i)}
                            />
                            <Tooltip title="Add another image">
                                <IconButton
                                    onClick={handleAddImage}
                                    sx={{
                                        height: '55px',
                                        width: '55px',
                                        marginTop: '8px',
                                    }}
                                >
                                    <AddCircleOutlined
                                        sx={{
                                            height: '40px',
                                            width: '40px',
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )
                })}
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
                    {!suggested && (
                        <FormControlLabel
                            label="Post project to discord"
                            control={
                                <Checkbox
                                    checked={isPostingToDiscord}
                                    onChange={(event) =>
                                        setIsPostingToDiscord(
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                        />
                    )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        sx={{ marginRight: '8px' }}
                    >
                        Cancel
                    </Button>

                    <LoadingButton
                        loading={isSaving}
                        loadingPosition="start"
                        startIcon={<Save />}
                        variant="outlined"
                        onClick={handleSave}
                    >
                        Save
                    </LoadingButton>
                </Box>
            </Box>
        </Modal>
    )
}
