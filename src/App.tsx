import React, { useState, lazy, Suspense } from 'react';
import { MembersArea } from './components/MembersArea';
import { MemberUser, STORAGE_USER_KEY } from './types/auth';

const LoginScreen = lazy(() => import('./components/LoginScreen').then(m => ({ default: m.LoginScreen })));

function getInitialUser(): MemberUser | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_USER_KEY) || localStorage.getItem(STORAGE_USER_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore storage errors
  }
  return null;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<MemberUser | null>(getInitialUser);

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
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0b0c0e]" />}>
        <LoginScreen onLogin={handleLogin} />
      </Suspense>
    );
  }

  return <MembersArea currentUser={currentUser} onLogout={handleLogout} />;
}
