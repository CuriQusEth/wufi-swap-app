import React from 'react';

interface WalletButtonProps {
  address: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({ address, isConnecting, onConnect, onDisconnect }: WalletButtonProps) {
  if (address) {
    return (
      <button
        onClick={onDisconnect}
        className="bg-input border border-border text-text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-border transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-success"></div>
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="bg-input border border-border text-text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
