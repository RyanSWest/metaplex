import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  const { connection } = useConnection();
  const { publicKey, wallet, connect, disconnect, connected, connecting } = useWallet();
  const [balance, setBalance] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch SOL balance when publicKey changes
  useEffect(() => {
    let mounted = true;
    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const lamports = await connection.getBalance(publicKey);
          if (mounted) setBalance((lamports / 1e9).toFixed(4));
        } catch (err) {
          console.error('Failed to get balance', err);
          if (mounted) setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };
    fetchBalance();
    return () => { mounted = false };
  }, [publicKey, connection]);

  // Close dropdown if click outside (keeps previous behavior if you add a custom dropdown later)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // placeholder: could close custom UI
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnect = async () => {
    try {
      if (!wallet) {
        // No adapter available; fallback to WalletMultiButton UI
        // WalletMultiButton will prompt the user to install/choose a wallet
        alert('No wallet adapter found. Use the standard connect button that appears in the top-right.');
        return;
      }
      await connect();
    } catch (err) {
      console.error('Connect failed', err);
      alert('Connection failed: ' + (err?.message || err));
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setBalance(null);
    } catch (err) {
      console.error('Disconnect failed', err);
    }
  };

  const shortKey = publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : null;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {connected && publicKey && (
        <div className="terminal-text" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div>Connected</div>
          <div>Balance: {balance ?? '—'}</div>
        </div>
      )}

      {/* Primary connect button: use the adapter UI when available */}
      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
        {wallet ? (
          <>
            <button className="cyberpunk-button" onClick={connected ? handleDisconnect : handleConnect} disabled={connecting}>
              {connected ? shortKey : 'Connect Wallet'}
            </button>
          </>
        ) : (
          // If no adapter is present, show the WalletMultiButton which handles UI for users
          <WalletMultiButton />
        )}
      </div>
    </div>
  );
}
