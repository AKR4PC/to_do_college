import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, ListTodo, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const PRIORITY_COLOR = { high: '#ff7979', medium: '#ffa048', low: '#78d700' };

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{value}</p>
        <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage({ tasks = [] }) {
  const { user } = useAuth();

  const todo       = tasks.filter(t => t.columnId === 'todo').length;
  const inprogress = tasks.filter(t => t.columnId === 'inprogress').length;
  const done       = tasks.filter(t => t.columnId === 'done').length;
  const total      = tasks.length;
  const pct        = total ? Math.round((done / total) * 100) : 0;

  const upcoming = tasks
    .filter(t => t.dueDateISO && t.columnId !== 'done')
    .sort((a, b) => new Date(a.dueDateISO) - new Date(b.dueDateISO))
    .slice(0, 5);

  const highPriority = tasks.filter(t => t.priority === 'high' && t.columnId !== 'done');

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      {/* Greeting */}
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-7">
        <StatCard icon={ListTodo}    label="To do"       value={todo}       color="#888da7" />
        <StatCard icon={Clock}       label="In progress" value={inprogress}  color="#ffa048" />
        <StatCard icon={CheckCircle2} label="Done"       value={done}       color="#78d700" />
        <StatCard icon={TrendingUp}  label="Completion"  value={`${pct}%`}  color="#4f8ef7" />
      </div>

      {/* Overall progress bar */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Overall Progress</span>
          <span className="text-sm font-bold" style={{ color: '#4f8ef7' }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #4f8ef7, #78d700)' }} />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{done} of {total} tasks completed</p>
      </div>

      {/* Upcoming due dates */}
      {upcoming.length > 0 && (
        <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Upcoming Deadlines</span>
          </div>
          <div className="flex flex-col gap-2">
            {upcoming.map(t => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                  {t.projectName && <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.projectName}</p>}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,160,72,0.12)', color: '#ffa048' }}>
                  {t.dueDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High priority */}
      {highPriority.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={15} style={{ color: '#ff7979' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>High Priority</span>
          </div>
          <div className="flex flex-col gap-2">
            {highPriority.slice(0, 4).map(t => (
              <div key={t._id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#ff7979' }} />
                <p className="text-[13px] font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,121,121,0.12)', color: '#ff7979' }}>
                  {t.columnId === 'inprogress' ? 'In progress' : t.columnId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
