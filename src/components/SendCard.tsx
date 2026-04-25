import React, { useState } from 'react';
import { Settings, AlertCircle, CheckCircle2, Loader2, Send, ArrowDown, X } from 'lucide-react';
import { TOKENS } from '../lib/contracts';
import { useLogs } from '../context/LogContext';
import { AppKit } from '@circle-fin/app-kit';
import { createViemAdapterFromProvider } from '@circle-fin/adapter-viem-v2';
import type { EIP1193Provider } from 'viem';

interface SendCardProps {
  address: string | null;
}

const TOKEN_KEYS = Object.keys(TOKENS) as Array<keyof typeof TOKENS>;

const kit = new AppKit();

export function SendCard({ address }: SendCardProps) {
  const { logAction } = useLogs();
  const [tokenKey, setTokenKey] = useState<keyof typeof TOKENS>('USDC');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSend = async () => {
    if (!address || !window.ethereum) {
      alert('Cüzdanını bağla.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Geçerli bir miktar gir.');
      return;
    }
    if (!recipient || recipient.length !== 42) {
      alert('Geçerli bir adres gir.');
      return;
    }

    setIsSending(true);
    setTxStatus('pending');
    setErrorMessage(null);
    setTxHash(null);

    try {
      const adapter = await createViemAdapterFromProvider({
        provider: window.ethereum as EIP1193Provider,
      });

      const result = await kit.send({
        from: { adapter, chain: 'Arc_Testnet' },
        to: recipient,
        amount: amount,
        token: tokenKey, 
      });

      setTxHash(result.txHash ?? null);
      setTxStatus('success');
      logAction('Send Token', address, `Sent ${amount} ${tokenKey} to ${recipient.slice(0,8)}...`);

    } catch (error: any) {
      setErrorMessage(error.message || 'Gönderim başarısız.');
      setTxStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="bg-card w-full max-w-[480px] p-4 rounded-[24px] border border-border shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Send className="text-[#3d6eff]" size={22} /> Send Token
          </h2>
          <button className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-sm">
            <Settings size={18} />
          </button>
        </div>

        <div className="space-y-2 relative">
          {/* Amount and Token */}
          <div className="bg-input rounded-2xl p-4 border border-transparent focus-within:border-[#3d6eff] transition-colors relative z-10">
            <div className="text-xs text-text-secondary mb-2">You Send</div>
            <div className="flex justify-between items-center">
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-4xl bg-transparent border-none text-text-primary w-full outline-none placeholder:text-text-secondary font-medium tracking-tight"
              />
              <div className="relative shrink-0 ml-4">
                <select
                  value={tokenKey}
                  onChange={(e) => setTokenKey(e.target.value as keyof typeof TOKENS)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  {TOKEN_KEYS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="bg-card border border-border py-2 px-3 rounded-full flex items-center gap-2 pointer-events-none hover:bg-white/5 transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${tokenKey === 'USDC' ? 'bg-[#2775ca]' : 'bg-[#e2a828]'}`}>
                    {tokenKey.slice(0, 1)}
                  </div>
                  <span className="font-bold text-base">{tokenKey}</span>
                  <ArrowDown size={14} className="text-text-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Address */}
          <div className="bg-input rounded-2xl p-4 border border-transparent focus-within:border-[#3d6eff] transition-colors relative z-0">
             <div className="text-xs text-text-secondary mb-2">To Recipient Address</div>
             <input
               type="text"
               placeholder="0x..."
               value={recipient}
               onChange={(e) => setRecipient(e.target.value)}
               className="text-sm bg-transparent border-none text-text-primary w-full outline-none placeholder:text-text-secondary font-mono tracking-wide"
             />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSend}
          disabled={!address || isSending || !amount || Number(amount) <= 0 || !recipient}
          className={`w-full p-4 rounded-xl text-lg font-bold mt-4 transition-all shadow-lg ${
            !address || !amount || Number(amount) <= 0 || !recipient
              ? 'bg-input text-text-secondary cursor-not-allowed opacity-70'
              : isSending
                ? 'bg-[#3d6eff]/50 text-white cursor-wait opacity-80'
                : 'bg-[#3d6eff] hover:bg-[#2b5ae6] hover:shadow-[#3d6eff]/20 active:scale-[0.98] text-white'
          }`}
        >
          {!address ? 'Connect Wallet' : isSending ? 'Approving & Sending...' : 'Send on Testnet'}
        </button>
      </div>

      {/* Transaction Status Overlay */}
      {txStatus !== 'idle' && (
        <div className={`fixed bottom-10 right-10 bg-card border px-6 py-4 rounded-xl flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 min-w-[300px] ${
          txStatus === 'pending' ? 'border-[#3d6eff]' :
          txStatus === 'success' ? 'border-success' :
          'border-red-500'
        }`}>
          {txStatus === 'pending' && <Loader2 className="animate-spin text-[#3d6eff]" size={20} />}
          {txStatus === 'success' && <CheckCircle2 className="text-success" size={20} />}
          {txStatus === 'error' && <AlertCircle className="text-red-500" size={20} />}
          
          <div>
            <h4 className="text-sm font-semibold mb-0.5">
              {txStatus === 'pending' ? 'Transaction Pending' : txStatus === 'success' ? 'Send Successful' : 'Execution Failed'}
            </h4>
            <div className="absolute top-2 right-2">
              <button onClick={() => setTxStatus('idle')} className="text-text-secondary hover:text-white">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-text-secondary max-w-xs break-words">
              {txStatus === 'pending' && 'Approving & moving funds onchain...'}
              {txStatus === 'success' && (
                <>
                  Funds sent successfully.{' '}
                  {txHash && (
                    <a 
                      href={`https://testnet.arcscan.app/tx/${txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#3d6eff] underline hover:text-white"
                    >
                      View on Explorer
                    </a>
                  )}
                </>
              )}
              {txStatus === 'error' && errorMessage}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
