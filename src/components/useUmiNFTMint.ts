import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  createNft, 
  mplTokenMetadata
} from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  generateSigner, 
  percentAmount
} from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

export interface UmiNFTMetadata {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
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
    console.log('RPC', connection.rpcEndpoint);
    
    const mint = generateSigner(umi);
    console.log('🔑 Generated mint address:', mint.publicKey);

    const nftOptions = {
      mint,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: percentAmount(metadata.sellerFeeBasisPoints / 100),
    };

    console.log('🎨 Creating NFT...');
    
    await createNft(umi, nftOptions).sendAndConfirm(umi);

    const explorerLink = `https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`;

    console.log('✅ NFT Created!', explorerLink);

    return {
      mint: mint.publicKey.toString(),
      name: metadata.name,
      uri: metadata.uri,
      explorerLink,
    };
  };

  return { mintNFT, publicKey: wallet.publicKey };
}