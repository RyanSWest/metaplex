import { Connection, Keypair } from '@solana/web3.js';
import { 
  createNft, 
  mplTokenMetadata,
  fetchDigitalAsset
} from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  generateSigner, 
  percentAmount,
  publicKey as umiPublicKey,
  createSignerFromKeypair,
  signerIdentity
} from '@metaplex-foundation/umi';
import * as fs from 'fs';

export interface UmiNFTMetadata {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  collectionAddress?: string;
}

export async function mintNFTWithKeypair(
  metadata: UmiNFTMetadata,
  keypairPath: string = 'C:\\Users\\bluem\\.config\\solana\\id.json',
  rpcEndpoint: string = 'https://api-mainnet.helius-rpc.com/v0/transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef'
) {
  // Load keypair from file
  const keypairFile = fs.readFileSync(keypairPath, 'utf-8');
  const keypairData = JSON.parse(keypairFile);
  const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

  console.log('🔑 Using wallet:', keypair.publicKey.toString());

  // Create UMI instance
  const umi = createUmi(rpcEndpoint);
  umi.use(mplTokenMetadata());

  // Convert Solana keypair to UMI format
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(keypair.secretKey);
  const signer = createSignerFromKeypair(umi, umiKeypair);
  umi.use(signerIdentity(signer));

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

  const explorerLink = `https://explorer.solana.com/address/${createdNft.mint.publicKey}?cluster=custom&customUrl=${encodeURIComponent(rpcEndpoint)}`;

  console.log('✅ NFT Created!', explorerLink);

  return {
    mint: createdNft.mint.publicKey.toString(),
    name: createdNft.metadata.name,
    uri: createdNft.metadata.uri,
    explorerLink,
  };
}

// Example usage:
/*
const metadata = {
  name: "My Test NFT",
  symbol: "TEST",
  uri: "https://arweave.net/your-metadata-uri",
  sellerFeeBasisPoints: 500, // 5%
};

mintNFTWithKeypair(metadata)
  .then(result => console.log('Minted:', result))
  .catch(err => console.error('Error:', err));
*/