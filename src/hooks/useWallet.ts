import { useState, useEffect } from 'react';
import { createViemAdapterFromProvider } from '@circle-fin/adapter-viem-v2';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [adapter, setAdapter] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet.');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const viemAdapter = await createViemAdapterFromProvider({ provider: window.ethereum });
        setAdapter(viemAdapter);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setAdapter(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          createViemAdapterFromProvider({ provider: window.ethereum }).then(setAdapter);
        } else {
          disconnect();
        }
      });
    }
  }, []);

  return { address, adapter, isConnecting, connect, disconnect };
}
