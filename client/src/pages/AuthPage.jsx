import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return;
    setLoading(true);

    // Demo mode — no backend needed
    await new Promise(r => setTimeout(r, 600)); // fake loading feel

    const name = form.name || form.email.split('@')[0];
    const fakeUser = {
      _id: 'demo-user-001',
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: form.email,
      teamName: 'My Team',
    };

    saveAuth({ token: 'demo-token-' + Date.now(), user: fakeUser });
    toast.success(`Welcome, ${fakeUser.name}! 👋`);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-app)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'var(--text-primary)' }}>
            <span className="text-2xl font-extrabold" style={{ color: 'var(--bg-app)' }}>T</span>
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Sign in to your workspace' : 'Start managing your tasks'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 shadow-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>FULL NAME</label>
                <input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Vincent Chase"
                  style={{ background: 'var(--border)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#4f8ef7] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                required
                style={{ background: 'var(--border)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
                className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#4f8ef7] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>PASSWORD</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="••••••••"
                style={{ background: 'var(--border)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
                className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#4f8ef7] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: 'var(--text-primary)', color: 'var(--bg-card)' }}
              className="w-full py-3 rounded-xl text-sm font-bold mt-1 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? '...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')}
              className="font-bold hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Demo hint */}
        <p className="text-center text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
          Demo mode — enter any email to continue
        </p>
      </div>
    </div>
  );
}
