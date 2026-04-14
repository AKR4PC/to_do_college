import { useAuth } from '../context/AuthContext';
import { Users, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export default function TeamsPage({ tasks = [] }) {
  const { user } = useAuth();

  const stats = {
    todo:       tasks.filter(t => t.columnId === 'todo').length,
    inprogress: tasks.filter(t => t.columnId === 'inprogress').length,
    done:       tasks.filter(t => t.columnId === 'done').length,
  };

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>Team</h2>

      {/* Team card */}
      <div className="rounded-2xl p-6 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(79,142,247,0.12)' }}>
            <Users size={22} style={{ color: '#4f8ef7' }} />
          </div>
          <div>
            <p className="font-extrabold text-base" style={{ color: 'var(--text-primary)' }}>{user?.teamName || 'My Team'}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>1 member</p>
          </div>
        </div>

        {/* Member */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--border)' }}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(120,215,0,0.12)', color: '#78d700' }}>
            Owner
          </span>
        </div>
      </div>

      {/* Task distribution */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Task Distribution</p>
        {[
          { label: 'To do',       value: stats.todo,       icon: ListTodo,    color: '#888da7' },
          { label: 'In progress', value: stats.inprogress, icon: Clock,       color: '#ffa048' },
          { label: 'Done',        value: stats.done,       icon: CheckCircle2, color: '#78d700' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 mb-3 last:mb-0">
            <Icon size={14} style={{ color }} />
            <span className="text-sm font-semibold flex-1" style={{ color: 'var(--text-muted)' }}>{label}</span>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-center mt-6" style={{ color: 'var(--text-muted)' }}>
        Multi-member collaboration coming soon
      </p>
    </div>
  );
}
