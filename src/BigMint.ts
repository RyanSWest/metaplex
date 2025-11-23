//  import React, { useState, useEffect } from 'react';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { useUmiNFTMint } from './useUmiNFTMint';
// import { useCreateCollection } from './useCreateCollection';

// export function MintGalleryComponent() {
//   const { publicKey } = useWallet();
//   const { mintNFT } = useUmiNFTMint();
//   const { createCollection } = useCreateCollection();

//   // State
//   const [gallery, setGallery] = useState<any[]>([]);
//   const [isMinting, setIsMinting] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [mintedNfts, setMintedNfts] = useState<any[]>([]);
//   const [errors, setErrors] = useState<Array<{ photoId: number; error: string }>>([]);
//   const [collectionAddress, setCollectionAddress] = useState<string>('');
//   const [cancelMinting, setCancelMinting] = useState(false);

//   const API = 'https://maybeart.app/api/nft-metadata/';
//   const userurl = 'https://maybeart.app/api/gallery/Super@Cat.com';
//   const API2 = 'https://maybeart.app/api/gallery/Super@Cat.com/collection';

//   // Fetch gallery on mount
//   useEffect(() => {
//     console.log("Fetching from:", userurl);
    
//     fetch(userurl)
//       .then(res => res.json()) 
//       .then(data => {
//         console.log("Gallery data:", data.gallery);
//         setGallery(data.gallery || []);
//       })
//       .catch(err => console.error("Error fetching gallery:", err));
//   }, []);

//   // Mint entire gallery
//   const mintEntireGallery = async () => {
//     if (!publicKey) {
//       alert('Connect wallet first!');
//       return;
//     }
    
//     if (!gallery || gallery.length === 0) {
//       alert('No photos to mint!');
//       return;
//     }

//     setIsMinting(true);
//     setProgress(0);
//     setMintedNfts([]);
//     setErrors([]);
//     setCancelMinting(false);

//     const totalSteps = gallery.length + 1;
//     let successCount = 0;
//     const failedItems: Array<{ photoId: number; error: string }> = [];

//     try {
//       console.log('🏗️ Creating collection...');
      
//       const collection = await createCollection({
//         name: `NFT Gallery ${new Date().toLocaleDateString()}`,
//         symbol: "GALLERY",
//         uri: API2
//       });

//       if (cancelMinting) {
//         console.log('❌ Cancelled after collection creation');
//         alert('Minting cancelled. Collection was created but no NFTs were minted.');
//         return;
//       }

//       setCollectionAddress(collection.collectionAddress);
//       console.log('✅ Collection created:', collection.collectionAddress);
//       console.log('🔗 Explorer:', collection.explorerLink);
//       setProgress(Math.round((1 / totalSteps) * 100));

//       for (let i = 0; i < gallery.length; i++) {
//         if (cancelMinting) {
//           console.log(`❌ Cancelled at photo ${i + 1}/${gallery.length}`);
//           alert(`Minting cancelled. ${successCount} NFTs minted before cancellation.`);
//           return;
//         }

//         const photo = gallery[i];
        
//         try {
//           console.log(`🎨 Minting ${i + 1}/${gallery.length}: ${photo.title}`);
          
//           const photoUri = API.endsWith('/') 
//             ? `${API}${photo.id}` 
//             : `${API}/${photo.id}`;
          
//           const nft = await mintNFT({
//             name: photo.title || `Photo #${photo.id}`,
//             symbol: "PHOTO",
//             uri: photoUri,
//             sellerFeeBasisPoints: 500
//           }, collection.collectionAddress);

//           setMintedNfts(prev => [...prev, nft]);
//           successCount++;
//           console.log(`✅ Minted photo ${photo.id}`);
          
//         } catch (error: any) {
//           console.error(`❌ Failed photo ${photo.id}:`, error);
//           const errorMsg = error.message || 'Unknown error';
//           failedItems.push({ photoId: photo.id, error: errorMsg });
//           setErrors(prev => [...prev, { photoId: photo.id, error: errorMsg }]);
//         }

//         const currentStep = i + 2;
//         setProgress(Math.round((currentStep / totalSteps) * 100));
        
//         if (i < gallery.length - 1) {
//           await new Promise(resolve => setTimeout(resolve, 1500));
//         }
//       }

//       const message = failedItems.length === 0
//         ? `✅ Success! Minted all ${successCount} NFTs\n\nCollection: ${collection.explorerLink}`
//         : `⚠️ Completed: ${successCount} succeeded, ${failedItems.length} failed\n\nCollection: ${collection.explorerLink}`;
      
//       alert(message);
      
//       if (failedItems.length > 0) {
//         console.log('Failed items:', failedItems);
//       }

//     } catch (error: any) {
//       console.error('❌ Collection creation failed:', error);
//       alert(`Failed to create collection: ${error.message || 'Unknown error'}`);
//     } finally {
//       setIsMinting(false);
//       setProgress(100);
//       setCancelMinting(false);
//     }
//   };

//   const handleCancelMinting = () => {
//     if (window.confirm('Are you sure you want to cancel minting?')) {
//       setCancelMinting(true);
//     }
//   };

//   return (
//     <>
//     <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
//       <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
//         🎨 Mint Your Gallery as NFTs
//       </h1>

//       <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//         <WalletMultiButton />
//       </div>

//       {/* Gallery Preview */}
//       <div style={{ 
//         marginBottom: '30px', 
//         padding: '20px', 
//         background: '#f5f5f5', 
//         borderRadius: '10px' 
//       }}>
//         <h3>Your Gallery ({gallery.length} photos)</h3>
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
//           gap: '15px',
//           marginTop: '15px'
//         }}>
//           {gallery.slice(0, 6).map((item: any) => (
//             <div key={item.id} style={{ 
//               border: '1px solid #ccc', 
//               borderRadius: '8px', 
//               overflow: 'hidden',
//               backgroundColor: 'white'
//             }}>
//               {item.type === 'file' ? (
//                 <img 
//                   src={`https://maybeart.app${item.imageUrl}`} 
//                   alt={item.title}
//                   style={{ width: '100%', height: '150px', objectFit: 'cover' }}
//                 />
//               ) : (
//                 <img 
//                   src={item.url} 
//                   alt={item.title} 
//                   style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
//                 />
//               )}
//               <p style={{ 
//                 padding: '8px', 
//                 fontSize: '12px', 
//                 textAlign: 'center',
//                 margin: 0,
//                 fontWeight: 'bold',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 whiteSpace: 'nowrap'
//               }}>
//                 {item.title}
//               </p>
//             </div>
//           ))}
//         </div>
//         {gallery.length > 6 && (
//           <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
//             ...and {gallery.length - 6} more
//           </p>
//         )}
//       </div>

//       {/* Mint Button & Progress */}
//       <div>
//         {!isMinting ? (
//           <button 
//             onClick={mintEntireGallery}
//             disabled={!gallery || gallery.length === 0 || !publicKey}
//             style={{ 
//               width: '100%',
//               padding: '20px',
//               fontSize: '20px',
//               fontWeight: 'bold',
//               backgroundColor: (!gallery || gallery.length === 0 || !publicKey) ? '#ccc' : '#9945FF',
//               color: 'white',
//               border: 'none',
//               borderRadius: '10px',
//               cursor: (!gallery || gallery.length === 0 || !publicKey) ? 'not-allowed' : 'pointer',
//               transition: 'all 0.3s'
//             }}
//             onMouseEnter={(e) => {
//               if (publicKey && gallery.length > 0) {
//                 e.currentTarget.style.backgroundColor = '#7d31d9';
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (publicKey && gallery.length > 0) {
//                 e.currentTarget.style.backgroundColor = '#9945FF';
//               }
//             }}
//           >
//             🚀 Mint All {gallery.length} Photos as NFTs
//           </button>
//         ) : (
//           <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
//             {/* Progress bar */}
//             <div style={{ 
//               width: '100%', 
//               backgroundColor: '#e0e0e0', 
//               borderRadius: '10px', 
//               height: '40px', 
//               overflow: 'hidden',
//               marginBottom: '20px',
//               position: 'relative'
//             }}>
//               <div style={{ 
//                 width: `${progress}%`, 
//                 backgroundColor: '#9945FF', 
//                 height: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: 'white',
//                 fontWeight: 'bold',
//                 fontSize: '16px',
//                 transition: 'width 0.3s ease'
//               }}>
//                 {progress}%
//               </div>
//             </div>
            
//             {/* Status text */}
//             <div style={{ 
//               textAlign: 'center', 
//               fontSize: '16px', 
//               color: '#333', 
//               marginBottom: '20px',
//               fontWeight: '500'
//             }}>
//               {progress === 0 && "⏳ Initializing..."}
//               {progress > 0 && progress < Math.round((1 / (gallery.length + 1)) * 100) && "🏗️ Creating collection..."}
//               {progress >= Math.round((1 / (gallery.length + 1)) * 100) && progress < 100 && 
//                 `🎨 Minting NFTs... ${mintedNfts.length}/${gallery.length} complete`}
//               {progress === 100 && "✅ Complete!"}
//             </div>

//             {/* Stats */}
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-around', 
//               marginBottom: '20px',
//               padding: '15px',
//               background: 'white',
//               borderRadius: '8px'
//             }}>
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
//                   {mintedNfts.length}
//                 </div>
//                 <div style={{ fontSize: '14px', color: '#666' }}>Minted</div>
//               </div>
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
//                   {errors.length}
//                 </div>
//                 <div style={{ fontSize: '14px', color: '#666' }}>Failed</div>
//               </div>
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6c757d' }}>
//                   {gallery.length - mintedNfts.length - errors.length}
//                 </div>
//                 <div style={{ fontSize: '14px', color: '#666' }}>Remaining</div>
//               </div>
//             </div>

//             {/* Cancel button */}
//             <button
//               onClick={handleCancelMinting}
//               style={{ 
//                 width: '100%',
//                 padding: '15px',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 backgroundColor: '#dc3545',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s'
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
//               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
//             >
//               ❌ Cancel Minting
//             </button>
//           </div>
//         )}

//         {/* Collection address display */}
//         {collectionAddress && (
//           <div style={{ 
//             marginTop: '20px', 
//             padding: '20px', 
//             backgroundColor: '#d4edda', 
//             border: '2px solid #c3e6cb',
//             borderRadius: '10px' 
//           }}>
//             <p style={{ 
//               fontSize: '16px', 
//               color: '#155724', 
//               fontWeight: 'bold', 
//               marginBottom: '10px',
//               marginTop: 0
//             }}>
//               ✅ Collection Created!
//             </p>
//             <a
//               href={`https://explorer.solana.com/address/${collectionAddress}?cluster=devnet`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ 
//                 fontSize: '14px', 
//                 color: '#28a745', 
//                 wordBreak: 'break-all',
//                 textDecoration: 'underline'
//               }}
//             >
//               View on Solana Explorer →
//             </a>
//             <p style={{ 
//               fontSize: '12px', 
//               color: '#666', 
//               marginTop: '10px',
//               marginBottom: 0,
//               fontFamily: 'monospace'
//             }}>
//               {collectionAddress}
//             </p>
//           </div>
//         )}

//         {/* Error details */}
//         {errors.length > 0 && (
//           <div style={{ 
//             marginTop: '20px', 
//             padding: '20px', 
//             backgroundColor: '#f8d7da', 
//             border: '2px solid #f5c6cb',
//             borderRadius: '10px',
//             maxHeight: '200px',
//             overflowY: 'auto'
//           }}>
//             <p style={{ 
//               fontSize: '16px', 
//               color: '#721c24', 
//               fontWeight: 'bold', 
//               marginBottom: '10px',
//               marginTop: 0
//             }}>
//               ⚠️ Failed Items:
//             </p>
//             {errors.map((err, idx) => (
//               <div key={idx} style={{ 
//                 fontSize: '12px', 
//                 color: '#721c24', 
//                 marginBottom: '5px',
//                 paddingBottom: '5px',
//                 borderBottom: idx < errors.length - 1 ? '1px solid #f5c6cb' : 'none'
//               }}>
//                 <strong>Photo #{err.photoId}:</strong> {err.error}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   );
// }