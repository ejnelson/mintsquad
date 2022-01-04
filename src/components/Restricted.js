import { MintSquad } from './MintSquad'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletNfts } from '@nfteyez/sol-rayz-react'

const validAuthorities = [
    // 'BV8MTEdwNVCjqJEaFMVkSVok3J6p6Fj4GDuQ1AYdchaW',
    // 'trshC9cTgL3BPXoAbp5w9UfnUMWEJx5G61vUijXPMLH',
    'DC2mkgwhy56w3viNtHDjJQmc7SGu2QX785bS4aexojwX',
]

const editAccessTokenIds = [
    'DFbzg1eDCWoVsPLxLDB7sMJdKMt1PniyscKCQQmNKfoj',
    '9qnt3toDcZnzh3KWoqMGj5HYyccmCpo6bgoXEY7TBXxx',
]

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
        editAccessTokenIds.includes(nft.mint)
    )
    console.log('nfts', nfts)
    console.log('can edit', walletHasEditAccessToken)

    return (
        <>
            {isLoading ? (
                <div>loading</div>
            ) : walletHasValidNfts ? (
                <MintSquad editAccess={walletHasEditAccessToken} />
            ) : (
                <div>
                    You are not authorized, please connect with a wallet
                    containing a Degen Ape Academy NFT to access the Mint Squad
                    Mint Board
                </div>
            )}
        </>
    )
}
