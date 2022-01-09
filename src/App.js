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
import React, { useCallback, useMemo } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Layout } from './components/Layout'
import { Notification } from './Notification'
import { ThemeProvider } from './ThemeProvider'
import { BrowserRouter } from 'react-router-dom'
export const App = () => {
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
        <ThemeProvider>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} onError={onError} autoConnect>
                    <WalletModalProvider>
                        <BrowserRouter>
                            <Layout />
                        </BrowserRouter>
                    </WalletModalProvider>
                    <Toaster position="bottom-right" reverseOrder={false} />
                </WalletProvider>
            </ConnectionProvider>
        </ThemeProvider>
    )
}
