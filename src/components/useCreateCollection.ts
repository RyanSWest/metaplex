import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  createNft, 
  mplTokenMetadata,
  fetchDigitalAsset
} from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  generateSigner, 
  percentAmount
} from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

export function useCreateCollection() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createCollection = async (collectionMetadata: {
    name: string;
    symbol: string;
    uri: string;
  }) => {
    if (!wallet.publicKey) throw new Error('Wallet not connected');

    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet));

    console.log('🏗️ Creating collection...');
    
    const collectionMint = generateSigner(umi);

    await createNft(umi, {
      mint: collectionMint,
      name: collectionMetadata.name,
      symbol: collectionMetadata.symbol,
      uri: collectionMetadata.uri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: true, // ⭐ This makes it a collection!
    }).sendAndConfirm(umi);

    console.log('⏳ Waiting for sync...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const explorerLink = `https://explorer.solana.com/address/${collectionMint.publicKey}?cluster=devnet`;
    
    console.log('✅ Collection created!', explorerLink);

    return {
      collectionAddress: collectionMint.publicKey.toString(),
      explorerLink
    };
  };

  return { createCollection };
}