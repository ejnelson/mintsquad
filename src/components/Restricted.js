import { MintSquad } from './MintSquad'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletNfts } from '@nfteyez/sol-rayz-react'

const validAuthorities = [
    // 'BV8MTEdwNVCjqJEaFMVkSVok3J6p6Fj4GDuQ1AYdchaW', trashpanda
    // 'trshC9cTgL3BPXoAbp5w9UfnUMWEJx5G61vUijXPMLH',trashpanda
    'DC2mkgwhy56w3viNtHDjJQmc7SGu2QX785bS4aexojwX',
]

const editAccessTokenIds = {
    minneapeolis: 'DFbzg1eDCWoVsPLxLDB7sMJdKMt1PniyscKCQQmNKfoj',
    Jpegjoey: '9qnt3toDcZnzh3KWoqMGj5HYyccmCpo6bgoXEY7TBXxx',
    ens: '1SAUDbRNcMR727X7Ai3kGRd17a6gvnvWx56wAtPH8gi',
    astroboy: '9A8ibbhzyhLvWzvmoxUEbCWtD2FZg1oTq7kpQdNxoi8J',
    dajuice: '3yFT48CbV4tzHiqG1nBCEWw1kYap5e3vCuLHqstCjoUK',
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
