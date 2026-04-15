import React from 'react';
import { SwapCard } from './components/SwapCard';
import { WalletButton } from './components/WalletButton';
import { useWallet } from './hooks/useWallet';

export default function App() {
  const { address, adapter, isConnecting, connect, disconnect } = useWallet();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3d6eff] to-[#ff3dbe]"></div>
          Arc Swap
        </div>
        <WalletButton 
          address={address} 
          isConnecting={isConnecting} 
          onConnect={connect} 
          onDisconnect={disconnect} 
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center relative p-4">
        <SwapCard adapter={adapter} address={address} />
        
        <div className="absolute bottom-5 left-5 text-xs text-text-secondary flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#f1c40f] rounded-full"></div>
          Connected to Arc_Testnet
        </div>
      </main>
    </div>
  );
}
