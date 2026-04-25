import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LogEntry = {
  id: string;
  timestamp: string;
  actionType: string;
  address: string;
  details: string;
  circleResponse: string;
};

interface LogContextType {
  logs: LogEntry[];
  logAction: (actionType: string, address: string, details: string) => Promise<void>;
  clearLogs: () => void;
}

export const LogContext = createContext<LogContextType>({
  logs: [],
  logAction: async () => {},
  clearLogs: () => {}
});

export const useLogs = () => useContext(LogContext);

export const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const logAction = async (actionType: string, address: string, details: string) => {
    try {
      const res = await fetch('/api/circle/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, address, details })
      });
      const data = await res.json();
      
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        actionType,
        address,
        details,
        circleResponse: data.circleResponse || 'No response'
      };

      setLogs((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error("Failed to log action:", err);
      const errEntry: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        actionType,
        address,
        details,
        circleResponse: 'Frontend Fetch Error'
      };
       setLogs((prev) => [errEntry, ...prev]);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <LogContext.Provider value={{ logs, logAction, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};
