import { useState } from 'react';
import { X } from 'lucide-react';

const COLORS = ['#4f8ef7', '#ffa048', '#ff7979', '#78d700', '#a855f7', '#ec4899'];

export default function AddProjectModal({ onClose, onAdd }) {
  const [name, setName]   = useState('');
  const [color, setColor] = useState('#4f8ef7');
  const [desc, setDesc]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onAdd({ name, color, description: desc });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rounded-2xl shadow-2xl w-full max-w-sm p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>New Project</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 transition-opacity">
            <X size={17} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>PROJECT NAME *</label>
            <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dribbble marketing"
              style={{ background: 'var(--border)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:border-[#4f8ef7] transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>DESCRIPTION</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Optional description"
              style={{ background: 'var(--border)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:border-[#4f8ef7] transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-2 block" style={{ color: 'var(--text-muted)' }}>COLOR</label>
            <div className="flex gap-2.5">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all duration-150"
                  style={{ background: c, outline: color === c ? `3px solid ${c}` : '3px solid transparent', outlineOffset: '2px', transform: color === c ? 'scale(1.15)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose}
              style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold hover:opacity-70 transition-opacity">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ background: 'var(--text-primary)', color: 'var(--bg-card)' }}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
              {loading ? '...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
