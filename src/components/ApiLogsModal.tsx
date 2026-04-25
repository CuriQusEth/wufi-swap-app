import React, { useState } from 'react';
import { Terminal, X, Server, Trash2 } from 'lucide-react';
import { useLogs } from '../context/LogContext';

export function ApiLogsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { logs, clearLogs } = useLogs();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-card border border-border px-4 py-2 rounded-xl text-text-secondary hover:text-white transition-colors flex items-center gap-2 shadow-lg z-40"
      >
        <Terminal size={16} className={`${logs.length > 0 ? 'text-[#3d6eff]' : ''}`} />
        <span className="text-sm font-semibold">API Logs</span>
        {logs.length > 0 && (
          <span className="bg-[#3d6eff] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
            {logs.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl border border-border rounded-xl shadow-2xl flex flex-col h-[70vh]">
            <div className="flex justify-between items-center p-4 border-b border-border bg-input/50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <Server size={18} className="text-[#3d6eff]" />
                <h3 className="font-semibold">Circle API & Backend Logs</h3>
              </div>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={clearLogs}
                  className="text-text-secondary hover:text-red-400 transition-colors"
                  title="Clear Logs"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-text-secondary hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3 font-mono text-xs">
              {logs.length === 0 ? (
                <div className="text-center text-text-secondary py-10 flex flex-col items-center gap-2">
                   <Terminal className="opacity-20" size={32} />
                   <p>No actions logged yet. Perform a transaction to see API calls.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="bg-input p-3 rounded-lg border border-border break-words">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                      <span className="text-[#3d6eff] font-bold">{log.actionType}</span>
                      <span className="text-text-secondary">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="space-y-1">
                       <div><span className="text-text-secondary">Address:</span> {log.address}</div>
                       <div><span className="text-text-secondary">Details:</span> {log.details}</div>
                       <div className="mt-2 pt-2 border-t border-white/5">
                          <span className="text-[#f1c40f]">Circle API State:</span> <span className="text-success">{log.circleResponse}</span>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
