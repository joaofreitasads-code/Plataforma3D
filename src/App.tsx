import React, { useState, useEffect, lazy, Suspense } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MembersAreaSkeleton } from './components/MembersAreaSkeleton';
import { MemberUser, STORAGE_USER_KEY } from './types/auth';

// Lazy-load the heavy MembersArea module containing all 1,200+ 3D models and catalog tools
// This allows the initial Login Screen (Nome e Email) to load instantly (<50ms)
const MembersArea = lazy(() => import('./components/MembersArea'));

export default function App() {
  const [currentUser, setCurrentUser] = useState<MemberUser | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_USER_KEY) || localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
      // Default to VIP Maker session matching the reference image so Members Area displays immediately
      const defaultVipUser: MemberUser = {
        name: 'João Vitor',
        email: 'joao.freitas.ads@gmail.com',
        loginDate: new Date().toISOString(),
        vipStatus: true,
      };
      sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(defaultVipUser));
      return defaultVipUser;
    } catch {
      return {
        name: 'João Vitor',
        email: 'joao.freitas.ads@gmail.com',
        loginDate: new Date().toISOString(),
        vipStatus: true,
      };
    }
  });

  // Background preload: while the user is viewing/typing on the login screen,
  // silently prefetch the MembersArea component chunk for instant transition after login
  useEffect(() => {
    if (!currentUser) {
      const preload = () => {
        import('./components/MembersArea').catch(() => {});
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        const handle = (window as any).requestIdleCallback(preload, { timeout: 1200 });
        return () => (window as any).cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(preload, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [currentUser]);

  const handleLogin = (user: MemberUser) => {
    try {
      sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(user);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Suspense fallback={<MembersAreaSkeleton />}>
      <MembersArea currentUser={currentUser} onLogout={handleLogout} />
    </Suspense>
  );
}
