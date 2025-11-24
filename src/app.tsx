import { NFTMintComponent } from './components/NftMint';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
// import Gallery from './components/gallery.jsx'
import { AppHeader } from './components/app-header';
import { AppLayout } from './components/app-layout';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  // const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);
 // https://api-mainnet.helius-rpc.com/v0/transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef
// https://mainnet.helius-rpc.com/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef
// https://api-mainnet.helius-rpc.com/v0/addresses/{address}/transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef
  // const endpoint ='https://mainnet.helius-rpc.com/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef'
// const endpoint = useMemo(() => 'http://127.0.0.1:8899', []);  
// const endpoint = 'https://api.devnet.solana.com'

// const endpoint ='https://devnet.rpcpool.com'

//  const endpoint = useMemo(() => 'https://solana-api.projectserum.com', []);

//parsee transactions

// const point='https://api-mainnet.helius-rpc.com/v0/transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef'




//##############################DEVNET######################

// const endpoint ='https://devnet.helius-rpc.com/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef'

const endpoint ='https://mainnet.helius-rpc.com/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef'
//  https://dataseed.helioschain.network	


// https://api-devnet.helius-rpc.com/v0/transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef
// https://api-devnet.helius-rpc.com/v0/addresses/{address}/transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef

const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>

          {/* <AppHeader/> */}
           <NFTMintComponent />
           
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;