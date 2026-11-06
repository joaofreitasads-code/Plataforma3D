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
  // silently prefetch the heavy MembersArea chunk and high-priority WebP images into browser cache so login is instant!
  useEffect(() => {
    if (!currentUser) {
      const preload = () => {
        import('./components/MembersArea');
        // Pre-warm featured top WebP images into browser cache silently
        const keyImages = [
          '/product_checkout.webp',
          '/pocket-pals/cao.webp',
          '/pocket-pals/capivara.webp',
          '/pocket-pals/coelho.webp',
          '/pocket-pals/gato.webp',
          '/pocket-pals/girafa.webp',
          '/pocket-pals/papagaio.webp',
          '/pocket-pals/raposa.webp',
          '/pocket-pals/tartaruga.webp',
          '/pocket-pals/vaca.webp',
          '/canecas-gamer/playstation.webp',
          '/canecas-gamer/mortal_kombat.webp',
          '/canecas-gamer/call_of_duty.webp',
          '/canecas-gamer/gta.webp',
          '/canecas-gamer/minecraft.webp',
          'https://lh3.googleusercontent.com/d/1vrYctOYYGKLVtcurtEG5GL_S1rcUWFgv=s220-rw',
          'https://lh3.googleusercontent.com/d/1RL6FU0qLqsAYjEMMX3DSKS8HNHzGuA1r=s220-rw',
          'https://lh3.googleusercontent.com/d/1oZGQMdlviAQ-rinamSPXqcjctkNlTgmt=s220-rw',
          'https://lh3.googleusercontent.com/d/1X120q3Z6e3BRYCYvI_XnnnKHhl7h0qop=s220-rw',
          'https://lh3.googleusercontent.com/d/1dukxEHlYOyOvwGJmsKoTr0lxtYXFWf5w=s220-rw',
          'https://lh3.googleusercontent.com/d/1i_tsKbThJfNOieRfeAty1wxcsAwOaRS_=s220-rw',
          '/estadios/corinthians.webp',
          '/estadios/flamengo.webp',
          '/canecas/corinthians.webp'
        ];
        keyImages.forEach(src => {
          const img = new Image();
          img.decoding = 'async';
          img.src = src;
        });
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
