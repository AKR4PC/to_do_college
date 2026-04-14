import {
  LayoutDashboard, FolderKanban, Users, Bell,
  MessageSquare, Settings, LogOut
} from 'lucide-react';

const NAV = [
  { id: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'board',     Icon: FolderKanban,    label: 'Board'     },
  { id: 'teams',     Icon: Users,           label: 'Teams'     },
  { id: 'alerts',    Icon: Bell,            label: 'Alerts'    },
  { id: 'messages',  Icon: MessageSquare,   label: 'Messages'  },
  { id: 'settings',  Icon: Settings,        label: 'Settings'  },
];

export default function Sidebar({ activePage, onNavigate, onLogout, unreadCount = 0 }) {
  return (
    <aside style={{ background: 'var(--bg-sidebar)' }}
      className="flex flex-col items-center w-[72px] h-screen py-5 shrink-0 z-20">

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-3 mt-2">
        {NAV.map(({ id, Icon, label }) => (
          <button key={id} title={label} onClick={() => onNavigate(id)}
            className="group relative w-full h-11 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: activePage === id ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: activePage === id ? 'white' : 'rgba(255,255,255,0.35)',
            }}>
            <div className="relative">
              <Icon size={19} strokeWidth={activePage === id ? 2.2 : 1.8} />
              {/* Unread badge on alerts */}
              {id === 'alerts' && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white"
                  style={{ background: '#ff7979' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {activePage === id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full" />
            )}
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg"
              style={{ background: 'var(--bg-sidebar)' }}>
              {label}
            </span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button title="Logout" onClick={onLogout}
        className="group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 mb-1"
        style={{ color: 'rgba(255,255,255,0.35)' }}
        onMouseEnter={e => e.currentTarget.style.color = '#ff7979'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
        <LogOut size={18} />
        <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg"
          style={{ background: 'var(--bg-sidebar)' }}>
          Logout
        </span>
      </button>
    </aside>
  );
}
