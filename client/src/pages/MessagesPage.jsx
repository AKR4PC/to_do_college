import { MessageSquare } from 'lucide-react';

const THREADS = [
  { id: 1, name: 'Design Team', last: 'Can you review the wireframes?', time: '2m ago', unread: 2, avatar: 'D' },
  { id: 2, name: 'Dev Channel', last: 'API is ready for testing', time: '1h ago', unread: 0, avatar: 'V' },
  { id: 3, name: 'Project Oreo', last: 'Brand guidelines updated', time: '3h ago', unread: 1, avatar: 'O' },
];

const COLORS = ['from-blue-400 to-indigo-500', 'from-orange-400 to-pink-500', 'from-green-400 to-teal-500'];

export default function MessagesPage() {
  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>Messages</h2>

      <div className="flex flex-col gap-2">
        {THREADS.map((t, i) => (
          <div
            key={t.id}
            className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {t.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.time}</p>
              </div>
              <p className="text-[12px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.last}</p>
            </div>
            {t.unread > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: '#4f8ef7' }}>
                {t.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <MessageSquare size={20} style={{ color: 'var(--text-muted)' }} />
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Real-time messaging coming soon
        </p>
      </div>
    </div>
  );
}
