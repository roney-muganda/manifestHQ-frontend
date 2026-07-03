// src/components/ui/OfflineBanner.tsx
import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-pale border-b border-amber/30 px-4 py-2 flex items-center gap-2 text-sm text-amber font-body shrink-0 transition-all">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>You are currently offline. Data may not be up to date.</span>
    </div>
  );
}