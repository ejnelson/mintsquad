import { MintSquad } from './MintSquad'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletNfts } from '@nfteyez/sol-rayz-react'
import {
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { LinearProgress, Box, Paper } from '@mui/material'

//working on auth in firebase
// import { getAuth, signInAnonymously } from 'firebase/auth'
// const auth = getAuth()
// signInAnonymously(auth)
//     .then(() => {
//         console.log('signed in anonymously')
//     })
//     .catch((error) => {
//         const errorCode = error.code
//         const errorMessage = error.message
//         // ...
//     })

const validAuthorities = [
    // 'BV8MTEdwNVCjqJEaFMVkSVok3J6p6Fj4GDuQ1AYdchaW', trashpanda
    // 'trshC9cTgL3BPXoAbp5w9UfnUMWEJx5G61vUijXPMLH',trashpanda
    'DC2mkgwhy56w3viNtHDjJQmc7SGu2QX785bS4aexojwX',
]

const editAccessTokenIds = {
    minneapeolis: 'DFbzg1eDCWoVsPLxLDB7sMJdKMt1PniyscKCQQmNKfoj',
    jpegjoey: '9qnt3toDcZnzh3KWoqMGj5HYyccmCpo6bgoXEY7TBXxx',
    ens: '1SAUDbRNcMR727X7Ai3kGRd17a6gvnvWx56wAtPH8gi',
    astroboy: '9A8ibbhzyhLvWzvmoxUEbCWtD2FZg1oTq7kpQdNxoi8J',
    dajuice: '3yFT48CbV4tzHiqG1nBCEWw1kYap5e3vCuLHqstCjoUK',
    vutek: '3XiXcM94o32Zv2D6CSkSCEZGeJUt2s5f91XmZuRMivaz',
    nftjordy: '6k4YpC3UWdxwCEmxRHgYdcaFJwZkB9oExECXZDttzsUG',
    topogigio: 'A6o66jgJh3fmd9HjvG7PH8iVpUatH2P2UG6pyqjBtXuH',
    rugnick: 'LHfKguKZwpCQgTZZZzQAGGqUP9f9a2knFYSU586Yd58',
    ryu: '37SZircdDb6jq2RFXuT3D4qNobBpSo2rZrggkUVonQDg',
}
export const Restricted = () => {
    const { wallet } = useWallet()

    const { publicKey } = wallet?.adapter || {}
    const { connection } = useConnection()
    const { nfts, isLoading, error } = useWalletNfts({
        publicAddress: publicKey,
        // pass your connection object to use specific RPC node
        connection,
    })
    const walletHasValidNfts = nfts?.some((nft) =>
        validAuthorities.includes(nft.updateAuthority)
    )
    const walletHasEditAccessToken = nfts?.some((nft) =>
        Object.values(editAccessTokenIds).includes(nft.mint)
    )
    return (
        <>
            {isLoading ? (
                <LinearProgress />
            ) : walletHasValidNfts ? (
                <MintSquad
                    editAccess={walletHasEditAccessToken}
                    walletId={publicKey?.toString()}
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
                            Log in with a wallet Containing a Degenerate Ape
                            Academy Nft to continue
                        </p>

                        <WalletMultiButton />
                    </Paper>
                </Box>
            )}
        </>
    )
}
