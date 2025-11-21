import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  keypairIdentity, 
  generateSigner, 
  percentAmount,
  publicKey 
} from '@metaplex-foundation/umi';
import { 
  createNft, 
  mplTokenMetadata,
  fetchDigitalAsset 
} from '@metaplex-foundation/mpl-token-metadata';

export async function main() {
  console.log('🚀 Starting...');

  // Generate a wallet (no file needed)
   const wallet = Keypair.generate();
  console.log('✅ Wallet created:', wallet.publicKey.toString());
  console.log('');
  console.log('🚰 Get SOL from faucet:');
  console.log(`https://faucet.solana.com/?address=${wallet.publicKey.toString()}`);
  console.log('');
  console.log('⏳ Waiting 30 seconds for you to get SOL from faucet...');
  console.log('Press Ctrl+C if you need more time');
  console.log('');
  
  // Connect to devnet
  const connection = new Connection(clusterApiUrl('devnet'));
  
  // Airdrop 1 SOL to the wallet
  console.log('💰 Requesting airdrop...');
  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    1 * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSignature);
  console.log('✅ Airdrop confirmed');

  // Setup UMI
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(wallet.secretKey);
  umi.use(keypairIdentity(umiKeypair));

  console.log('✅ UMI setup complete');

  // Create NFT
  console.log('🎨 Creating NFT...');
  
  const mint = generateSigner(umi);
  
  const collectionAddress = publicKey('ChfGtd2wT12c2u82PHNpe4PdQ5PMqJnVECfaNbQ2uaVw');

  const tx = await createNft(umi, {
    mint,
    name: 'My Test NFT',
    uri: 'https://maybeart.app/api/gallery/image/68',
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
      key: collectionAddress,
      verified: false,
    },
  });

  await tx.sendAndConfirm(umi);

  const nft = await fetchDigitalAsset(umi, mint.publicKey);

  console.log('✅ NFT CREATED!');
  console.log('🔗 Mint Address:', nft.mint.publicKey.toString());
  console.log('🌐 Explorer:', `https://explorer.solana.com/address/${nft.mint.publicKey}?cluster=devnet`);
}

main().catch(console.error);