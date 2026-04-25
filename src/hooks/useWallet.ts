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
        try {
          // Attempt to make window.ethereum writable so Circle adapter can proxy it
          const global = window as any;
          if (global.ethereum) {
             const ethConfig = Object.getOwnPropertyDescriptor(global, 'ethereum');
             if (ethConfig && (!ethConfig.writable || ethConfig.get)) {
                 Object.defineProperty(global, 'ethereum', {
                   value: global.ethereum,
                   writable: true,
                   configurable: true,
                   enumerable: ethConfig.enumerable,
                 });
             }
          }
        } catch (e) {
          console.warn('Could not make window.ethereum writable', e);
        }
        
        try {
            const viemAdapter = await createViemAdapterFromProvider({ provider: window.ethereum });
            setAdapter(viemAdapter);
        } catch (err: any) {
             console.error("Circle Adapter init error:", err);
        }
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
    if (window.ethereum && typeof window.ethereum.on === 'function') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          createViemAdapterFromProvider({ provider: window.ethereum })
            .then(setAdapter)
            .catch(err => console.error(err));
        } else {
          disconnect();
        }
      });
    }
  }, []);

  return { address, adapter, isConnecting, connect, disconnect };
}
