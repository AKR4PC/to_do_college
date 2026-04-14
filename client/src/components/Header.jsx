import { Bell, Calendar, X, Clock, Info, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TYPE_ICON  = { reminder: Clock, info: Info, warning: AlertTriangle };
const TYPE_COLOR = { reminder: '#ffa048', info: '#4f8ef7', warning: '#ff7979' };

export default function Header({ searchQuery, onSearchChange, notifOpen, setNotifOpen }) {
  const { notifs, unreadCount, readAll, readOne } = useNotifications();
  const { user } = useAuth();
  const { dark, toggle } = useTheme();

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <header
      style={{ background: 'var(--bg-header)', borderColor: 'var(--border)' }}
      className="flex items-center justify-between px-7 py-3 border-b shrink-0 backdrop-blur-sm relative z-10 gap-4"
    >
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <input
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          style={{ background: 'var(--border)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
          className="w-full pl-4 pr-8 py-2 rounded-xl text-[13px] font-medium outline-none focus:border-[#4f8ef7] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Date */}
        <div
          className="hidden md:flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl"
          style={{ color: 'var(--text-muted)', background: 'var(--border)' }}
        >
          <Calendar size={13} />
          {today}
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={toggle}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:opacity-70"
          style={{ background: 'var(--border)', color: 'var(--text-primary)' }}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(n => !n)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:opacity-70 relative"
            style={{ background: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white"
                style={{ background: '#ff7979' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Notifications{unreadCount > 0 && <span className="text-[#ff7979] ml-1">({unreadCount})</span>}
                </span>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button onClick={readAll} className="text-[11px] font-bold hover:opacity-70" style={{ color: '#4f8ef7' }}>
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} style={{ color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
                ) : notifs.map(n => {
                  const Icon  = TYPE_ICON[n.type] || Info;
                  const color = TYPE_COLOR[n.type] || '#4f8ef7';
                  return (
                    <div
                      key={n._id}
                      onClick={() => readOne(n._id)}
                      className="flex items-start gap-3 px-4 py-3 border-b last:border-0 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ borderColor: 'var(--border)', background: n.read ? 'transparent' : 'var(--border)' }}
                    >
                      <Icon size={13} style={{ color, marginTop: 2, flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>{n.text}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {new Date(n.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: color }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-105 transition-transform">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
