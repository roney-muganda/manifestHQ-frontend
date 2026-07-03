// src/components/layout/AppShell.tsx
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
// Note: This will show a TS error until we create it
import { OfflineBanner } from '@/components/ui/OfflineBanner';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <OfflineBanner />
        <TopBar />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}