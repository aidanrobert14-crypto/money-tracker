import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Auth() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset password');
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xl mx-auto mb-4">M</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t('appTitle')} <span className="text-emerald-500 text-sm">v2.0</span></h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">{isLogin ? t('authSecureLogin') : t('authCreateAccount')}</p>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded text-sm mb-4">{error}</div>}
        {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded text-sm mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('authEmail')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none placeholder:text-slate-600"
              placeholder="operator@fintrack.pro"
              required
            />
          </div>
          <div>
             <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('authPassword')}</label>
             <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none placeholder:text-slate-600"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 mt-6"
          >
            {loading ? t('authProcessing') : isLogin ? t('authAuthenticate') : t('authInitializeAccount')}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? t('authNeedAccount') : t('authAlreadyHaveAccount')}
          </button>
          
          {isLogin && (
            <button 
              type="button" 
              onClick={handleResetPassword}
              className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
            >
              {t('authRecoverPassword')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
