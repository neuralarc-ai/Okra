import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Mail, Lock, Eye, EyeOff, Check, Loader2, ArrowRight, ArrowLeft, User, KeyRound, ShieldCheck } from 'lucide-react';

const Auth = () => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (tab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccess('Signed in! Redirecting...');
        setTimeout(() => navigate('/app'), 1000);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Check your email to confirm your account!');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      // Supabase will redirect automatically
    } catch (err: any) {
      setError(err.message || 'Google sign-in error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setResetSent(true);
      setSuccess('Password reset email sent!');
    } catch (err: any) {
      setError(err.message || 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[url('/background.png')] bg-cover bg-top z-0" />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <main className="flex-1 flex flex-col items-center justify-center px-4 mb-6">
          <div className="flex flex-col items-center gap-6 animate-fadeUp">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center rounded-full bg-white/10 p-3">
                <Sparkles className="text-white w-8 h-8 animate-pulse" />
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight text-center">
                Welcome to Okra
              </h1>
            </div>
            <h2 className="text-lg md:text-xl text-white/80 font-medium text-center max-w-2xl mb-2">
              Sign in or create an account to continue
            </h2>
            <div className="bg-black/50 rounded-2xl shadow-xl border border-white/10 p-8 w-full max-w-md flex flex-col items-center">
              <div className="flex mb-6 w-full">
                <button
                  className={`flex-1 py-2 rounded-l-xl text-lg font-semibold transition-all duration-200 ${tab === 'signin' ? 'bg-white/10 text-white' : 'bg-transparent text-white/60'}`}
                  onClick={() => setTab('signin')}
                  disabled={loading}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 py-2 rounded-r-xl text-lg font-semibold transition-all duration-200 ${tab === 'signup' ? 'bg-white/10 text-white' : 'bg-transparent text-white/60'}`}
                  onClick={() => setTab('signup')}
                  disabled={loading}
                >
                  Sign Up
                </button>
              </div>
              <Button
                type="button"
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-lg py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 mb-4 border border-white/20"
                disabled={loading}
              >
                <img
                  src="/Google__G__logo.svg.png"
                  alt="Google logo"
                  className="w-5 h-5 mr-1"
                />
                Google
              </Button>
              <div className="flex items-center w-full my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="mx-3 text-xs text-white/50">OR CONTINUE WITH EMAIL</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <form className="w-full flex flex-col gap-4" onSubmit={handleAuth}>
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#9b87f5]"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] w-full"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {tab === 'signup' && (
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] w-full"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                      onClick={() => setShowConfirmPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}
                {tab === 'signin' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-[#9b87f5] hover:underline mt-1"
                      onClick={handleForgotPassword}
                      disabled={loading || !email}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full mt-2 bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-semibold text-lg py-3 rounded-lg shadow-md transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    tab === 'signin' ? 'Signing In...' : 'Signing Up...'
                  ) : (
                    tab === 'signin' ? 'Sign In' : 'Sign Up'
                  )}
                </Button>
                {error && <div className="text-red-400 text-sm text-center mt-2">{error}</div>}
                {success && <div className="text-green-400 text-sm text-center mt-2">{success}</div>}
                {resetSent && (
                  <div className="text-green-400 text-xs text-center mt-2">Password reset email sent! Check your inbox.</div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Auth; 