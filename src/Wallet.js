import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import React, { FC, useCallback, useMemo } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Restricted } from './components/Restricted'
import { Navigation } from './Navigation'
import { Notification } from './Notification'

export const Wallet = () => {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Mainnet
    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network])

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = useMemo(
        () => [
            getPhantomWallet(),
            getSlopeWallet(),
            getSolflareWallet(),
            getTorusWallet(),
            getLedgerWallet(),
            getSolletWallet({ network }),
            getSolletExtensionWallet({ network }),
        ],
        [network]
    )

    const onError = useCallback(
        (error) =>
            toast.custom(
                <Notification
                    message={
                        error.message
                            ? `${error.name}: ${error.message}`
                            : error.name
                    }
                    variant="error"
                />
            ),
        []
    )

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <WalletModalProvider>
                    <Navigation />
                    <Restricted />
                </WalletModalProvider>
                <Toaster position="bottom-right" reverseOrder={false} />
            </WalletProvider>
        </ConnectionProvider>
    )
}
