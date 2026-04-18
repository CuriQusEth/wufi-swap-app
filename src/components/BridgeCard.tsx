import React, { useState } from 'react';
import { AppKit } from '@circle-fin/app-kit';
import { ArrowDown, Settings, AlertCircle, CheckCircle2, Loader2, ArrowUpDown } from 'lucide-react';

interface BridgeCardProps {
  adapter: any;
  address: string | null;
}

const CHAINS = ['Ethereum_Sepolia', 'Arc_Testnet'];

export function BridgeCard({ adapter, address }: BridgeCardProps) {
  const [fromChain, setFromChain] = useState('Ethereum_Sepolia');
  const [toChain, setToChain] = useState('Arc_Testnet');
  const [amount, setAmount] = useState('');
  const [isBridging, setIsBridging] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBridge = async () => {
    if (!adapter || !address) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    
    if (fromChain === toChain) {
      alert('Please select different chains for Source and Destination.');
      return;
    }

    setIsBridging(true);
    setTxStatus('pending');
    setErrorMessage(null);
    setTxHash(null);

    try {
      const kit = new AppKit();
      
      const result = await kit.bridge({
        from: { adapter, chain: fromChain as any },
        to: { adapter, chain: toChain as any },
        amount: amount,
      });

      const foundHash = result.steps?.find(s => s.txHash)?.txHash || 'Unknown';
      setTxHash(foundHash);
      
      if (result.state === 'error') {
         const errStep = result.steps?.find(s => s.state === 'error');
         throw new Error(errStep?.errorMessage || errStep?.error?.toString() || 'Bridge transaction returned error state. E.g. insufficient funds or gas.');
      }
      setTxStatus('success');
    } catch (error: any) {
      console.error('Bridge failed:', error);
      let ms = error.message;
      if (typeof error === 'string') ms = error;
      setErrorMessage(ms || 'An unknown error occurred during the bridge transfer.');
      setTxStatus('error');
    } finally {
      setIsBridging(false);
    }
  };

  const handleSwitchChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  return (
    <>
      <div className="bg-card w-full max-w-[480px] p-3 rounded-[24px] border border-border shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="px-3 pt-2 pb-4 flex justify-between items-center">
          <h2 className="text-base font-semibold">Bridge USDC</h2>
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <Settings size={18} />
          </button>
        </div>

        <div className="space-y-1">
          {/* From Chain */}
          <div className="bg-input rounded-2xl p-4 border border-transparent hover:border-border transition-colors">
            <div className="text-xs text-text-secondary mb-2">From Chain</div>
            <div className="flex justify-between items-center">
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-[32px] bg-transparent border-none text-text-primary w-[50%] outline-none placeholder:text-text-secondary"
              />
              <div className="relative w-[45%]">
                <select
                  value={fromChain}
                  onChange={(e) => setFromChain(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  {CHAINS.map((c) => (
                    <option key={c} value={c}>{c.replace('_', ' ')}</option>
                  ))}
                </select>
                <div className="bg-card border border-border py-2 px-3 rounded-xl flex items-center justify-between pointer-events-none w-full">
                  <span className="font-semibold text-sm truncate">{fromChain.replace('_', ' ')}</span>
                  <ArrowDown size={14} className="ml-1 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <div className="h-10 w-10 bg-input border-4 border-card rounded-xl flex items-center justify-center -my-5 mx-auto z-10 relative text-text-secondary hover:text-text-primary cursor-pointer transition-colors" onClick={handleSwitchChains}>
            <ArrowUpDown size={16} />
          </div>

          {/* To Chain */}
          <div className="bg-input rounded-2xl p-4 border border-transparent hover:border-border transition-colors mt-1">
            <div className="text-xs text-text-secondary mb-2">To Chain</div>
            <div className="flex justify-between items-center">
              <input
                type="number"
                placeholder="0"
                readOnly
                value={amount}
                className="text-[32px] bg-transparent border-none text-text-secondary w-[50%] outline-none cursor-not-allowed"
              />
              <div className="relative w-[45%]">
                <select
                  value={toChain}
                  onChange={(e) => setToChain(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  {CHAINS.map((c) => (
                    <option key={c} value={c}>{c.replace('_', ' ')}</option>
                  ))}
                </select>
                <div className="bg-card border border-border py-2 px-3 rounded-xl flex items-center justify-between pointer-events-none w-full">
                  <span className="font-semibold text-sm truncate">{toChain.replace('_', ' ')}</span>
                  <ArrowDown size={14} className="ml-1 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBridge}
          disabled={!address || isBridging || !amount || Number(amount) <= 0 || fromChain === toChain}
          className={`w-full p-4 rounded-2xl text-lg font-semibold mt-3 transition-colors ${
            !address 
              ? 'bg-input text-text-secondary cursor-not-allowed'
              : isBridging || !amount || Number(amount) <= 0 || fromChain === toChain
                ? 'bg-accent/50 text-white/50 cursor-not-allowed'
                : 'bg-accent hover:bg-accent-hover text-white'
          }`}
        >
          {!address ? 'Connect Wallet' : fromChain === toChain ? 'Select different chains' : isBridging ? 'Bridging...' : 'Bridge'}
        </button>
      </div>

      {/* Transaction Status */}
      {txStatus !== 'idle' && (
        <div className={`fixed bottom-10 right-10 bg-card border px-6 py-4 rounded-xl flex flex-col gap-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 ${
          txStatus === 'pending' ? 'border-accent' :
          txStatus === 'success' ? 'border-success' :
          'border-red-500'
        }`}>
          <div className="flex items-center gap-3">
            {txStatus === 'pending' && <Loader2 className="animate-spin text-accent" size={20} />}
            {txStatus === 'success' && <CheckCircle2 className="text-success" size={20} />}
            {txStatus === 'error' && <AlertCircle className="text-red-500" size={20} />}
            
            <h4 className="text-sm font-semibold">
              {txStatus === 'pending' ? 'Bridge Pending' : txStatus === 'success' ? 'Bridge Successful' : 'Bridge Failed'}
            </h4>
          </div>
          <p className="text-xs text-text-secondary max-w-xs break-words mt-1 pl-8">
            {txStatus === 'pending' && 'Transaction is being processed...'}
            {txStatus === 'success' && (
              <>
                Bridged {amount} USDC from {fromChain.replace('_', ' ')} to {toChain.replace('_', ' ')}.{' '}
                {txHash && txHash !== 'Unknown' && (
                  <a href={`https://testnet.arcscan.app/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                    View explorer
                  </a>
                )}
              </>
            )}
            {txStatus === 'error' && errorMessage}
          </p>
        </div>
      )}
    </>
  );
}
