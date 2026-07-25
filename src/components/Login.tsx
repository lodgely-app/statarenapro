import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Trophy, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
}

export const Login = ({ onSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError('Invalid credentials. Please check your email and password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4 max-w-md mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sofa-card p-8 w-full space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-sofa-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sofa-blue/20">
            <Trophy className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-sofa-navy">Admin Portal</h2>
            <p className="text-[10px] font-bold text-sofa-muted uppercase tracking-[0.2em] mt-1">Authorized Access Only</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-sofa-muted uppercase tracking-widest ml-1">Admin Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sofa-muted/40" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tournament.com"
                className="w-full bg-slate-50 border border-sofa-border rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-sofa-blue transition-all font-bold text-sm text-sofa-text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-sofa-muted uppercase tracking-widest ml-1">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sofa-muted/40" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-sofa-border rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-sofa-blue transition-all font-bold text-sm text-sofa-text"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-sofa-live/5 border border-sofa-live/10 rounded-lg text-sofa-live text-[10px] font-bold animate-in fade-in zoom-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sofa-blue text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-sofa-blue/20 flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sofa-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-sofa-muted font-bold text-[10px] uppercase tracking-widest">Or</span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-sofa-border text-sofa-text hover:bg-slate-50 py-3.5 rounded-xl font-bold transition-all shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </form>
      </div>

      <p className="mt-8 text-[9px] font-bold text-sofa-muted uppercase tracking-[0.3em]">
        Powered by StatArena Security
      </p>
    </div>
  );
};
