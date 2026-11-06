import React, { useState } from 'react';
import { User, Mail, ShieldCheck, Sparkles, Box, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { MemberUser, STORAGE_USER_KEY } from '../types/auth';

interface LoginScreenProps {
  onLogin: (user: MemberUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('universo3d_last_name') || 'João Freitas';
    } catch {
      return 'João Freitas';
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('universo3d_last_email') || 'joao.freitas.ads@gmail.com';
    } catch {
      return 'joao.freitas.ads@gmail.com';
    }
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setError('');
    setIsLoading(true);

    const user: MemberUser = {
      name: trimmedName,
      email: trimmedEmail,
      loginDate: new Date().toISOString(),
      vipStatus: true
    };

    try {
      if (rememberMe) {
        localStorage.setItem('universo3d_last_name', trimmedName);
        localStorage.setItem('universo3d_last_email', trimmedEmail);
      }
      sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.error('Failed to save user session', err);
    }

    setIsLoading(false);
    onLogin(user);
  };

  const handleQuickLogin = (demoName: string, demoEmail: string) => {
    setName(demoName);
    setEmail(demoEmail);
    setError('');
  };

  const handleClear = () => {
    setName('');
    setEmail('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#ff6600] selection:text-white">
      {/* Background Ambient Glow (Orange & Deep Black) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
        <div
          className="w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 102, 0, 0.5) 0%, rgba(234, 88, 12, 0.25) 40%, transparent 70%)'
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6600]/15 border border-[#ff6600]/30 text-[#ff6600] text-xs font-bold uppercase tracking-wider mb-2 shadow-lg shadow-orange-950/40">
            <ShieldCheck className="w-4 h-4 text-[#ff6600] stroke-[2.5]" />
            <span>ÁREA DE MEMBROS VIP</span>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6600] via-[#ea580c] to-[#f59e0b] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-orange-950/40">
              <Box className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white font-sans">
              CENTRAL <span className="text-[#ff6600]">3D</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xs mx-auto leading-relaxed font-medium">
            Identifique-se com seu <strong className="text-white font-bold">Nome</strong> e <strong className="text-white font-bold">E-mail</strong> para acessar o catálogo exclusivo de modelos STL e o Drive oficial.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#13151a] border border-[#262933] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-red-300 text-xs font-bold text-left animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Input Nome */}
            <div className="space-y-1.5">
              <label htmlFor="login-name" className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>Seu Nome Completo</span>
              </label>
              <div className="relative">
                <input
                  id="login-name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Freitas"
                  className="w-full bg-[#181a20] border border-[#262933] focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/25 text-white placeholder-neutral-500 text-sm font-medium rounded-xl py-3 px-4 outline-none transition"
                />
              </div>
            </div>

            {/* Input E-mail */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>Seu E-mail de Acesso</span>
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-[#181a20] border border-[#262933] focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/25 text-white placeholder-neutral-500 text-sm font-medium rounded-xl py-3 px-4 outline-none transition"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white transition font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#262933] bg-[#181a20] text-[#ff6600] focus:ring-[#ff6600] focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <span>Lembrar meu acesso neste dispositivo</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#ff6600] hover:bg-[#ea580c] active:bg-[#c2410c] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 cursor-pointer active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <span>Acessando...</span>
              ) : (
                <>
                  <span>ENTRAR NA ÁREA DE MEMBROS</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Pre-fill Shortcut for João Freitas and Clear option */}
          <div className="pt-2 border-t border-[#262933] flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={handleClear}
              className="font-mono text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Limpar Campos
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('João Freitas', 'joao.freitas.ads@gmail.com')}
              className="font-mono text-[#ff6600] hover:text-orange-300 hover:underline transition cursor-pointer font-bold"
            >
              Preencher João Freitas
            </button>
          </div>
        </div>

        {/* Feature Highlights Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] font-mono text-neutral-400 text-center">
          <div className="p-2.5 rounded-xl bg-[#13151a] border border-[#262933] flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
            <span>Drive Liberado</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#13151a] border border-[#262933] flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
            <span>Licença Vitalícia</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#13151a] border border-[#262933] flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
            <span>STLs Oficiais</span>
          </div>
        </div>
      </div>
    </div>
  );
};
