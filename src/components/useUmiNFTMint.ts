import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  createNft, 
  mplTokenMetadata,
  fetchDigitalAsset
} from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  generateSigner, 
  percentAmount,
  publicKey as umiPublicKey
} from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

export interface UmiNFTMetadata {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  collectionAddress?: string;
}

export function useUmiNFTMint() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const mintNFT = async (metadata: UmiNFTMetadata) => {
    if (!wallet.publicKey) throw new Error('Wallet not connected');

    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet));

    console.log('✅ Set up UMI instance');

    const mint = generateSigner(umi);

    const nftOptions: any = {
      mint,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: percentAmount(metadata.sellerFeeBasisPoints / 100),
    };

    if (metadata.collectionAddress) {
      nftOptions.collection = {
        key: umiPublicKey(metadata.collectionAddress),
        verified: false,
      };
    }

    console.log('🎨 Creating NFT...');

    const transaction = await createNft(umi, nftOptions);
    await transaction.sendAndConfirm(umi);

    const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

    const explorerLink = `https://explorer.solana.com/address/${createdNft.mint.publicKey}?cluster=devnet`;

    console.log('✅ NFT Created!', explorerLink);

    return {
      mint: createdNft.mint.publicKey.toString(),
      name: createdNft.metadata.name,
      uri: createdNft.metadata.uri,
      explorerLink,
    };
  };

  return { mintNFT, publicKey: wallet.publicKey };
}