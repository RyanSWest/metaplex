

// NFTMintComponent.tsx - React component
import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useUmiNFTMint } from './createNft';
import { useWallet } from '@solana/wallet-adapter-react';

export function NFTMintComponent() {
  const { mintNFT } = useUmiNFTMint();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form state
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [uri, setUri] = useState('');
  const [royalty, setRoyalty] = useState(500); // 5%

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    setLoading(true);
    try {
      const metadata = {
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: royalty,
        creators: [
          {
            address: publicKey,
            verified: true,
            share: 100,
          },
        ],
      };

      const res = await mintNFT(metadata);
      setResult(res);
      alert('NFT Minted Successfully!');
    } catch (error) {
      console.error('Minting error:', error);
      alert('Minting failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Mint Your NFT</h1>
      <WalletMultiButton />

      {publicKey && (
        <form onSubmit={handleMint} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Symbol:</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Metadata URI (JSON):</label>
            <input
              type="url"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              required
              placeholder="https://arweave.net/..."
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Royalty (basis points, 500 = 5%):</label>
            <input
              type="number"
              value={royalty}
              onChange={(e) => setRoyalty(Number(e.target.value))}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Minting...' : 'Mint NFT'}
          </button>
        </form>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0' }}>
          <h3>Minting Successful!</h3>
          <p><strong>Signature:</strong> {result.signature}</p>
          <p><strong>Mint Address:</strong> {result.mint}</p>
          <p><strong>View on Solscan:</strong> 
            <a 
              href={`https://solscan.io/token/${result.mint}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View NFT
            </a>
          </p>
        </div>
      )}
    </div>
  );
}