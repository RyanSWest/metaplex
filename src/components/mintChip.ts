import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  generateSigner, 
  percentAmount,
  publicKey 
} from '@metaplex-foundation/umi';
import { 
  createNft, 
  mplTokenMetadata,
  fetchDigitalAsset 
} from '@metaplex-foundation/mpl-token-metadata';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

// ============================================
// STEP 1: PASTE YOUR PHANTOM WALLET ADDRESS HERE
// ============================================
const YOUR_WALLET_ADDRESS = 'PASTE_YOUR_PHANTOM_PUBLIC_KEY_HERE';

// ============================================
// STEP 2: GET DEVNET SOL MANUALLY
// ============================================
// 1. Open Phantom wallet
// 2. Switch to Devnet (Settings → Developer Settings → Testnet Mode)
// 3. Go to: https://faucet.solana.com
// 4. Paste your wallet address and get 1 SOL
// 5. Wait 30 seconds
// 6. Run this script
// ============================================

async function main() {
  console.log('🚀 Starting...');

  // Validate wallet address
  if (YOUR_WALLET_ADDRESS === 'PASTE_YOUR_PHANTOM_PUBLIC_KEY_HERE') {
    console.error('❌ ERROR: You need to paste your Phantom wallet address!');
    console.log('');
    console.log('How to get it:');
    console.log('1. Open Phantom wallet');
    console.log('2. Click on your wallet name at the top');
    console.log('3. Copy your public key (looks like: 7x8k...abc)');
    console.log('4. Paste it at the top of this file');
    console.log('');
    console.log('Then get devnet SOL:');
    console.log(`https://faucet.solana.com`);
    process.exit(1);
  }

  // Connect to devnet
  const connection = new Connection(clusterApiUrl('devnet'));
  
  const walletPubkey = new PublicKey(YOUR_WALLET_ADDRESS);
  
  // Check balance
  const balance = await connection.getBalance(walletPubkey);
  console.log('💰 Your Balance:', balance / 1e9, 'SOL');
  
  if (balance === 0) {
    console.error('❌ No SOL found!');
    console.log('');
    console.log('Get free devnet SOL here:');
    console.log(`https://faucet.solana.com/?address=${YOUR_WALLET_ADDRESS}`);
    console.log('');
    console.log('After getting SOL, run this script again!');
    process.exit(1);
  }

  // Create a mock wallet adapter for testing
  // This simulates what happens in a real browser dapp
  const mockWallet = {
    publicKey: walletPubkey,
    signTransaction: async (tx: any) => {
      console.log('⚠️  This is a simulation - in a real dapp, Phantom would sign');
      return tx;
    },
    signAllTransactions: async (txs: any[]) => txs,
  };

  // Setup UMI
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  
  // This will fail because we can't actually sign without Phantom
  // But it proves the setup works!
  console.log('⚠️  NOTE: This script shows you HOW to set it up');
  console.log('⚠️  For actual minting, you need to use the React component!');
  console.log('');
  console.log('✅ Connection works');
  console.log('✅ Wallet has SOL');
  console.log('✅ UMI is configured');
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Use the React component I provided earlier');
  console.log('2. Connect Phantom wallet in the browser');
  console.log('3. Click the mint button');
  console.log('');
  console.log('The browser version will actually work because Phantom can sign transactions!');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});