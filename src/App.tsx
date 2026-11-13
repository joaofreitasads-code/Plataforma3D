import React, { useState, useEffect, lazy, Suspense } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MembersAreaSkeleton } from './components/MembersAreaSkeleton';
import { MemberUser, STORAGE_USER_KEY } from './types/auth';

const loadMembersArea = () => import('./components/MembersArea');
const MembersArea = lazy(loadMembersArea);

function getInitialUser(): MemberUser | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_USER_KEY) || localStorage.getItem(STORAGE_USER_KEY);
    if (saved) return JSON.parse(saved);
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
}

const INITIAL_USER = getInitialUser();
// Start loading MembersArea chunk immediately in parallel if user is already logged in
if (INITIAL_USER) {
  loadMembersArea().catch(() => {});
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<MemberUser | null>(INITIAL_USER);

  useEffect(() => {
    if (!currentUser) {
      const preload = () => {
        loadMembersArea().catch(() => {});
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        const handle = (window as any).requestIdleCallback(preload, { timeout: 1200 });
        return () => (window as any).cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(preload, 300);
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
