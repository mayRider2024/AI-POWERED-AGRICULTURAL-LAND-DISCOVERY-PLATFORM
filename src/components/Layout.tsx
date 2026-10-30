import type { ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import GuestSaveModal from './GuestSaveModal';
import { useIsMobile } from '../hooks/useIsMobile';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider>
      {isMobile ? (
        /* Mobile Layout: content + fixed bottom nav (Sidebar never mounted) */
        <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-gray-50">
          <main className="flex-1 min-w-0 overflow-y-auto relative w-full">
            {children}
          </main>
          <BottomNav />
        </div>
      ) : (
        /* Desktop Layout (screens >= 768px on desktop browsers): sidebar + content */
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      )}
      {/* Global Guest Login Prompt Modal on Bookmark Attempt */}
      <GuestSaveModal />
    </ThemeProvider>
  );
}
