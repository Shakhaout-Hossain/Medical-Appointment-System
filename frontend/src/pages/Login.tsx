import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff, Heart, Shield, Calendar, Activity } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(userName, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Hero Panel ──────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] left-[-60px] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-40px] w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-violet-600 flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">MediConnect</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 animate-slide-up">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-8 animate-float">
            <Heart className="w-10 h-10 text-pink-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your Health,<br />
            <span className="gradient-text">Our Priority.</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-sm">
            Book appointments, connect with verified doctors, and manage your healthcare — all in one place.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: Calendar, text: 'Easy appointment scheduling' },
              { icon: Shield, text: 'Secure & private health records' },
              { icon: Heart, text: 'Verified specialist doctors' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 animate-slide-right" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary-300" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-slate-500 text-xs">"The greatest wealth is health." — Virgil</p>
        </div>
      </div>

      {/* ── Right Form Panel ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">MediConnect</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-slate-500 mt-1 text-sm">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2 animate-slide-up">
                <span className="w-1.5 h-1.5 bg-danger-500 rounded-full flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-11"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? '#818cf8'
                    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
                }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
