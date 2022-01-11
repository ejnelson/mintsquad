import { Box, Paper } from '@mui/material'

export const Alpha = ({ hasEditAccess, walletId }) => {
    return (
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
                <p style={{ fontSize: '20px' }}>Coming soon...</p>
            </Paper>
        </Box>
    )
}
