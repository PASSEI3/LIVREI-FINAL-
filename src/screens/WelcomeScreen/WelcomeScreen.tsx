import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface Props {
  onGoogleLogin: () => void;
  onCreateAccount: () => void;
  onLogin: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onGoogleLogin, onCreateAccount, onLogin, onSkip }: Props) {
  const [mode, setMode] = useState<'welcome' | 'login'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-purple-950">
      {/* Skip button */}
      <div className="flex items-center justify-end px-5 pt-5">
        <button onClick={onSkip} className="text-xs font-medium text-purple-400 active:scale-90">Pular</button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
        {mode === 'welcome' ? (
          <div className="flex w-full max-w-sm flex-col items-center animate-fade-in">
            {/* Logo */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-mint-400 text-4xl font-black text-purple-950 shadow-xl shadow-mint-400/20">
              L
            </div>
            <h1 className="text-3xl font-extrabold tracking-wide text-purple-50">LIVREI</h1>
            <p className="mt-2 text-sm font-medium text-mint-300">Quem desapega, lê mais.</p>

            {/* Buttons */}
            <div className="mt-10 w-full space-y-3">
              {/* Google */}
              <button
                onClick={onGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-3.5 text-sm font-bold text-purple-950 shadow-lg transition active:scale-95"
              >
                <GoogleIcon />
                Continuar com o Google
              </button>

              {/* Create account */}
              <button
                onClick={onCreateAccount}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-3.5 text-sm font-bold text-purple-950 shadow-lg shadow-mint-400/20 transition active:scale-95"
              >
                Criar conta com e-mail
              </button>
            </div>

            {/* Login link */}
            <button
              onClick={() => setMode('login')}
              className="mt-6 text-xs font-medium text-purple-300 active:scale-95"
            >
              Já tem uma conta? <span className="font-bold text-mint-400">Entrar</span>
            </button>
          </div>
        ) : (
          <div className="flex w-full max-w-sm flex-col items-center animate-fade-in">
            {/* Logo small */}
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-400 text-2xl font-black text-purple-950">
              L
            </div>
            <h1 className="text-2xl font-extrabold tracking-wide text-purple-50">LIVREI</h1>
            <p className="mt-1 text-sm font-medium text-mint-300">Entrar na sua conta</p>

            {/* Login form */}
            <div className="mt-8 w-full space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-purple-300">
                  <Mail className="h-4 w-4" /> E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="w-full rounded-xl bg-purple-900 px-3 py-3.5 text-sm text-purple-50 outline-none ring-1 ring-purple-700 placeholder:text-purple-500 focus:ring-mint-400"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-purple-300">
                  <Lock className="h-4 w-4" /> Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full rounded-xl bg-purple-900 px-3 py-3.5 pr-11 text-sm text-purple-50 outline-none ring-1 ring-purple-700 placeholder:text-purple-500 focus:ring-mint-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 active:scale-90"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowForgot(true)}
                className="text-xs font-medium text-purple-400 underline underline-offset-2 active:scale-95"
              >
                Esqueci minha senha
              </button>

              <button
                onClick={onLogin}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-3.5 text-sm font-bold text-purple-950 shadow-lg shadow-mint-400/20 transition active:scale-95"
              >
                Entrar <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {showForgot && (
              <div className="mt-4 w-full rounded-2xl bg-mint-400/10 p-4 ring-1 ring-mint-400/30 animate-fade-in">
                <p className="text-center text-xs leading-relaxed text-mint-200">
                  Enviaremos um link de recuperação para o seu e-mail cadastrado.
                </p>
                <button
                  onClick={() => setShowForgot(false)}
                  className="mt-2 w-full text-center text-[11px] font-semibold text-mint-400 underline underline-offset-2"
                >
                  Entendi, fechar
                </button>
              </div>
            )}

            {/* Back to welcome */}
            <button
              onClick={() => setMode('welcome')}
              className="mt-6 text-xs font-medium text-purple-300 active:scale-95"
            >
              Voltar
            </button>
          </div>
        )}
      </div>

      <p className="pb-6 text-center text-[10px] text-purple-600">LIVREI v1.0 · Troca de Livros</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
