import { useNotifications } from '../hooks/useNotifications';
import { Bell, CheckCheck, Clock, Info, AlertTriangle } from 'lucide-react';

const TYPE_ICON = {
  reminder: Clock,
  info:     Info,
  warning:  AlertTriangle,
};
const TYPE_COLOR = {
  reminder: '#ffa048',
  info:     '#4f8ef7',
  warning:  '#ff7979',
};

export default function AlertsPage() {
  const { notifs, unreadCount, readAll, readOne } = useNotifications();

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Alerts</h2>
          {unreadCount > 0 && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={readAll}
            className="flex items-center gap-1.5 text-xs font-bold hover:opacity-70 transition-opacity"
            style={{ color: '#4f8ef7' }}
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--border)' }}>
            <Bell size={20} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            Reminders appear here 7 hours before task due dates
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifs.map(n => {
            const Icon = TYPE_ICON[n.type] || Info;
            const color = TYPE_COLOR[n.type] || '#4f8ef7';
            return (
              <div
                key={n._id}
                onClick={() => !n.read && readOne(n._id)}
                className="rounded-xl p-4 cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  background: n.read ? 'var(--bg-card)' : 'var(--border)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18' }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>{n.text}</p>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      {new Date(n.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: color }} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
