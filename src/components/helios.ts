import { Connection } from '@solana/web3.js';


 // const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);

// https://api-mainnet.helius-rpc.com/v0/transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef
// https://mainnet.helius-rpc.com/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef
// https://api-mainnet.helius-rpc.com/v0/addresses//transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef
  // const endpoint ='https://mainnet.helius-rpc.com/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef'
// const endpoint = useMemo(() => 'http://127.0.0.1:8899', []);  
// const endpoint = 'https://api.devnet.solana.com'

// Your Helius RPC URL from dashboard
const rpcUrl = 'https://api-mainnet.helius-rpc.com/v0/transactions/?api-key=200d3c22-0618-44c6-b928-768bbd9f8aef';

const connection = new Connection(rpcUrl);

// Test the connection
const testConnection = async () => {
  try {
    const version = await connection.getVersion();
    const slot = await connection.getSlot();
    
    console.log('Connection successful!');
    console.log(`Solana version: ${version['solana-core']}`);
    console.log(`Current slot: ${slot}`);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

testConnection();