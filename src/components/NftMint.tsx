import React, { useState,useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useUmiNFTMint } from './useUmiNFTMint.ts';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import WalletButton from './WalletButton.tsx';
// import {createCollection} from useCreateCollection
// import 'gallery.css'
import { useCreateCollection } from './useCreateCollection';export function NFTMintComponent() {
  const { mintNFT } = useUmiNFTMint();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const[id,setId]=useState<any>(null);
//  const [cancelMinting, setCancelMinting] = useState(false);

//   const [collectionAddress, setCollectionAddress] = useState<string | null>(null);
//   const [errors, setErrors] = useState<any[]>([]);

//   const { createCollection } = useCreateCollection(); // ← Like this
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
 const [collect,setCollect]=useState([]);
 
 const [isMinting,setIsMinting]=useState(false);
 const [Progress,setProgress]=useState(0);
 const [mintedNfts,setMintedNfts]=useState([])
   
  
  
  const API = (`https://maybeart.app/api/nft-metadata/`);
  // localStorage.getItem('userToken'); // or from login
 const userurl= 'https://maybeart.app/api/gallery/Super@Cat.com'
  const API2=`https://maybeart.app/api/gallery/Super@Cat.com/collection`
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

    fetch(API2)
    .then(res => res.json())
    .then(data => {
      console.log("data",data);
      setCollect(data)
      console.log(collect)

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
   
     console.log("Connected wallet:",  publicKey?.toString());
console.log("Network:", connection.rpcEndpoint);
console.log("Balance:",publicKey );
    console.log('ATA',ataAddress)
    // console.log(window.solana.publicKey.toString());
  const meta = async (id: any) => {
    console.log(id)
  return fetch(`${API}${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}

meta(id)


  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Connect wallet first!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {



    
    
      const metadata = {
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: royalty,
      };

      console.log('🚀 Starting mint...');
      const res = await mintNFT(metadata);
      setResult(res);
      alert('✅ NFT Minted Successfully!');
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert('Failed: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };



  //###############WHOLE THING MINT WHOLE THING ####################



  // Add this function:
  // Add this state at the top with your other state declarations
 
// Updated function with cancel support
// const mintEntireGallery = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   if (!publicKey) {
//     alert('Connect wallet first!');
//     return;
//   }
  
//   if (!gallery || gallery.length === 0) {
//     alert('No photos to mint!');
//     return;
//   }

//   setIsMinting(true);
//   setProgress(0);
//   setMintedNfts([]);
//   setErrors([]);
//   setCancelMinting(false);

//   const totalSteps = gallery.length + 1;
//   let successCount = 0;
//   const failedItems: Array<{ photoId: number; error: string }> = [];

//   try {
//     console.log('🏗️ Creating collection...');
    
//     const collection = await createCollection({
//       name: `NFT Gallery ${new Date().toLocaleDateString()}`,
//       symbol: "GALLERY",
//       uri: API2
//     });

//     if (cancelMinting) {
//       console.log('❌ Cancelled after collection creation');
//       alert('Minting cancelled. Collection was created but no NFTs were minted.');
//       return;
//     }

//     setCollectionAddress(collection.collectionAddress);
//     console.log('✅ Collection created:', collection.collectionAddress);
//     console.log('🔗 Explorer:', collection.explorerLink);
//     setProgress(Math.round((1 / totalSteps) * 100));

//     for (let i = 0; i < gallery.length; i++) {
//       if (cancelMinting) {
//         console.log(`❌ Cancelled at photo ${i + 1}/${gallery.length}`);
//         alert(`Minting cancelled. ${successCount} NFTs minted before cancellation.`);
//         return;
//       }

//       const photo = gallery[i];
      
//       try {
//         console.log(`🎨 Minting ${i + 1}/${gallery.length}: ${photo.title}`);
        
//         const photoUri = API.endsWith('/') 
//           ? `${API}${photo.id}` 
//           : `${API}/${photo.id}`;
        
//         const nft = await mintNFT({
//           name: photo.title || `Photo #${photo.id}`,
//           symbol: "PHOTO",
//           uri: photoUri,
//           sellerFeeBasisPoints: 500
//         }, collection.collectionAddress);

//         setMintedNfts(prev => [...prev, nft]);
//         successCount++;
//         console.log(`✅ Minted photo ${photo.id}`);
        
//       } catch (error: any) {
//         console.error(`❌ Failed photo ${photo.id}:`, error);
//         const errorMsg = error.message || 'Unknown error';
//         failedItems.push({ photoId: photo.id, error: errorMsg });
//         setErrors(prev => [...prev, { photoId: photo.id, error: errorMsg }]);
//       }

//       const currentStep = i + 2;
//       setProgress(Math.round((currentStep / totalSteps) * 100));
      
//       if (i < gallery.length - 1) {
//         await new Promise(resolve => setTimeout(resolve, 1500));
//       }
//     }

//     const message = failedItems.length === 0
//       ? `✅ Success! Minted all ${successCount} NFTs\n\nCollection: ${collection.explorerLink}`
//       : `⚠️ Completed: ${successCount} succeeded, ${failedItems.length} failed\n\nCollection: ${collection.explorerLink}`;
    
//     alert(message);
    
//     if (failedItems.length > 0) {
//       console.log('Failed items:', failedItems);
//     }

//   } catch (error: any) {
//     console.error('❌ Collection creation failed:', error);
//     alert(`Failed to create collection: ${error.message || 'Unknown error'}`);
//   } finally {
//     setIsMinting(false);
//     setProgress(100);
//     setCancelMinting(false);
//   }
// };

// const handleCancelMinting = () => {
//   if (window.confirm('Are you sure you want to cancel minting?')) {
//     setCancelMinting(true);
//   }
// };

















  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>🎨 Mint Your NFT</h1>
      
 



      <section>

<div className="gallery-grid">
  {gallery.map((item: any) => {
    const imageUrl = item.type === 'file' 
      ? `https://maybeart.app${item.imageUrl}` 
      : item.url;
    
    const isSelected = selectedImage?.id === item.id;
    
    return (
      <div 
        key={item.id}
        className={`gallery-item ${isSelected ? 'selected' : ''}`}
        onClick={() => {
          setSelectedImage(item);
          setId(item.id);
          setUri(`${API}${item.id}`);
          setName(item.title);
          setSymbol('ART');
        }}
      >
        <img src={imageUrl} alt={item.title} />
        <div className="gallery-info">
          <h4>{item.title}</h4>
          <p>{item.description}</p>
        </div>
      </div>
    );
  })}
</div>


{gallery.map((item: any) => (
  <div 
    key={item.id} 
    onClick={() => {
      const imageUrl = item.type === 'file' 
        ? `https://maybeart.app${item.imageUrl}` 
        : item.url;
      
      setSelectedImage(item);
      setId(item.id)
      setUri(`${API}${item.id}`)
       setName(item.title); // Optionally set name too
      setSymbol('ART');
      
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
