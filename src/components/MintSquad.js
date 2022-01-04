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
import { TextField, Box, Button } from '@mui/material'
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

export const MintSquad = ({ editAccess }) => {
    const [isEditing, setIsEditing] = useState(null)
    const [edits, setEdits] = useState({})

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
        <div>
            {}
            {editAccess && (
                <Button onClick={handleAddProject} variant="contained">
                    addProject
                </Button>
            )}
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
        </div>
    )
}
