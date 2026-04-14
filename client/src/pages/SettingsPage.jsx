import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateSettings } from '../api/auth';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { User, Lock, Palette, LogOut } from 'lucide-react';

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={15} style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [name, setName]         = useState(user?.name || '');
  const [teamName, setTeamName] = useState(user?.teamName || '');
  const [curPwd, setCurPwd]     = useState('');
  const [newPwd, setNewPwd]     = useState('');
  const [saving, setSaving]     = useState(false);

  const inputStyle = {
    background: 'var(--border)',
    color: 'var(--text-primary)',
    border: '1.5px solid transparent',
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateSettings({ name, teamName });
      refreshUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const savePassword = async () => {
    if (!curPwd || !newPwd) return toast.error('Fill both password fields');
    if (newPwd.length < 6) return toast.error('New password must be 6+ chars');
    setSaving(true);
    try {
      await updateSettings({ password: curPwd, newPassword: newPwd });
      setCurPwd(''); setNewPwd('');
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setSaving(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>Settings</h2>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#4f8ef7] transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>TEAM NAME</label>
            <input value={teamName} onChange={e => setTeamName(e.target.value)} style={inputStyle}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#4f8ef7] transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>EMAIL</label>
            <input value={user?.email || ''} disabled style={{ ...inputStyle, opacity: 0.5 }}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none cursor-not-allowed" />
          </div>
          <button onClick={saveProfile} disabled={saving}
            style={{ background: 'var(--text-primary)', color: 'var(--bg-card)' }}
            className="py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
            Save profile
          </button>
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" icon={Lock}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>CURRENT PASSWORD</label>
            <input type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} placeholder="••••••••" style={inputStyle}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#4f8ef7] transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>NEW PASSWORD</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="••••••••" style={inputStyle}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#4f8ef7] transition-colors" />
          </div>
          <button onClick={savePassword} disabled={saving}
            style={{ background: 'var(--text-primary)', color: 'var(--bg-card)' }}
            className="py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
            Change password
          </button>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Dark mode</span>
          <button
            onClick={toggle}
            className="w-12 h-6 rounded-full relative transition-colors duration-200"
            style={{ background: dark ? '#4f8ef7' : 'var(--border)' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: dark ? '26px' : '2px' }}
            />
          </button>
        </div>
      </Section>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-red-500 hover:opacity-70 transition-opacity"
        style={{ border: '1px solid rgba(255,121,121,0.3)', background: 'rgba(255,121,121,0.05)' }}
      >
        <LogOut size={15} /> Sign out
      </button>
    </div>
  );
}
