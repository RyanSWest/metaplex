import React, { useState,useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useUmiNFTMint } from './useUmiNFTMint.ts';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';



export function NFTMintComponent() {
  const { mintNFT } = useUmiNFTMint();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form state
   const [name, setName] = useState<any>('My Test NFT');
  const [symbol, setSymbol] = useState<any>('TEST');
  const [uri, setUri] = useState('https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-nft-offchain-data.json');
  const [royalty, setRoyalty] = useState(5);
  const [gallery,setGallery]=useState([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
 const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [ataAddress, setAtaAddress] = useState<string>('');

   
  const token = 'MTc2MTQzNDU2MTY2MA=='
  const xx= atob(token)
  console.log('XX',xx)
  
  const API = (`https://maybeart.app/api/nft-metadata/`);
  // localStorage.getItem('userToken'); // or from login
 const userurl= 'https://maybeart.app/api/gallery/Super@Cat.com'

const allUsers = 'https://maybeart.app/api/users'
  useEffect(() => {
  console.log("Fetching from:", userurl);
  
  fetch(userurl)
    .then(res => res.json()) 
    .then(data => {
      console.log("Full data:", data);
      console.log("Gallery array:", data.gallery);
      setGallery(data.gallery);
    })
    .catch(err => console.error("Error:", err));

    fetch('https://maybeart.app/api/nft-metadata/66')
    .then(res => res.json())
    .then(data => {
      console.log("data",data);

    })
    .catch(err=> console.error("error:",err))
}, []);



  useEffect(() => {
    if (!publicKey) return;
    const getATA = async () => {
      const mintAddress = new PublicKey('5fqgV1UpossDXRND77XyzeJdg2Q8dkopT3poa1pHrS6');
      const ata = await getAssociatedTokenAddress(mintAddress, publicKey);
      setAtaAddress(ata.toString());
     };
    getATA();
    console.log("ATA==>",ataAddress)
  }, [publicKey]);
   


  
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Connect wallet first!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {



       // TEMPORARY MOCK - comment this out when you get SOL
    console.log('🎨 Would mint:', { name, symbol, uri, royalty });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockMint = 'MOCK' + Math.random().toString(36).substring(7);
    setResult({
      mint: mockMint,
      explorerLink: `https://explorer.solana.com/address/${mockMint}?cluster=testnet`
    });
    alert('✅ Mock NFT Minted! (Replace with real mint later)');
    
    //   const metadata = {
    //     name,
    //     symbol,
    //     uri,
    //     sellerFeeBasisPoints: royalty,
    //   };

    //   console.log('🚀 Starting mint...');
    //   const res = await mintNFT(metadata);
    //   setResult(res);
    //   alert('✅ NFT Minted Successfully!');
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert('Failed: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>🎨 Mint Your NFT</h1>
      





      <section>




{gallery.map((item: any) => (
  <div 
    key={item.id} 
    onClick={() => {
      const imageUrl = item.type === 'file' 
        ? `https://maybeart.app${item.imageUrl}` 
        : item.url;
      
      setSelectedImage(item);
      setUri(`${API}${item.id}`)
      // setUri (`https://maybeart.app/api/nft-metadata/${item.id}`);
      setName(item.title); // Optionally set name too
      setSymbol('ART'); // Set a defsetUri(`https://maybeart.app/api/nft-metadata/${item.id}`) 
      
      console.log("Selected for minting:", item,uri);
    }}
    style={{ 
      padding: '10px', 
      border: selectedImage?.id === item.id ? '3px solid #9945FF' : '1px solid #ccc',
      marginBottom: '10px',
      cursor: 'pointer',
      backgroundColor: selectedImage?.id === item.id ? '#f0e6ff' : 'white'
    }}
  >
    <p><strong>{item.title}</strong></p>
    <p>{item.description}</p>
    {item.type === 'file' ? (
      <img 
        src={`https://maybeart.app${item.imageUrl}`} 
        alt={item.title}
        style={{ maxWidth: '200px' }}
      />
    ) : (
      <img src={item.url} alt={item.title} style={{ maxWidth: '200px' }} />
    )}
  </div>
))}

{selectedImage && (
  <p style={{ marginTop: '20px', padding: '10px', background: '#e7f3ff', borderRadius: '5px' }}>
    ✅ Selected: <strong>{selectedImage.title}</strong> - Ready to mint!
  </p>
)}
      </section>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <WalletMultiButton />
      </div>

      {publicKey && (
        <form onSubmit={handleMint} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Symbol:
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Metadata URI:
            </label>
            <input
              type="url"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Royalty %:
            </label>
            <input
              type="number"
              value={royalty}
              onChange={(e) => setRoyalty(Number(e.target.value))}
              required
              min="0"
              max="100"
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '15px', 
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: loading ? '#ccc' : '#9945FF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Minting...' : '🚀 Mint NFT'}
          </button>
        </form>
      )}



      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', borderRadius: '10px' }}>
          <h3 style={{ color: '#28a745' }}>✅ Success!</h3>
          <p><strong>Mint:</strong> {result.mint}</p>
          <a 
            href={result.explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#007bff', fontWeight: 'bold' }}
          >
            🔍 View on Explorer
          </a>
        </div>
      )}
    </div>
  );
}
