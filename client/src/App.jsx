import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useNotifications } from './hooks/useNotifications';
import { useTasks } from './hooks/useTasks';
import { useProjects } from './hooks/useProjects';

import Sidebar from './components/Sidebar';
import ProjectsPanel from './components/ProjectsPanel';
import Header from './components/Header';

import AuthPage      from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage     from './pages/BoardPage';
import TeamsPage     from './pages/TeamsPage';
import AlertsPage    from './pages/AlertsPage';
import MessagesPage  from './pages/MessagesPage';
import SettingsPage  from './pages/SettingsPage';

const SHOW_PANEL = ['board', 'dashboard'];

function AppShell() {
  const { user, logout, loading: authLoading } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [activePage, setActivePage]     = useState('board');
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterColumn, setFilterColumn] = useState(null);
  const [notifOpen, setNotifOpen]       = useState(false);

  const { unreadCount } = useNotifications();

  // Single source of truth for tasks — shared across Board + ProjectsPanel
  const taskState   = useTasks();
  const projectState = useProjects();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-app)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--text-muted)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => { logout(); navigate('/login'); };

  // Task counts derived from the shared task list
  const taskCounts = {
    all:        taskState.tasks.length,
    todo:       taskState.tasks.filter(t => t.columnId === 'todo').length,
    inprogress: taskState.tasks.filter(t => t.columnId === 'inprogress').length,
    done:       taskState.tasks.filter(t => t.columnId === 'done').length,
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage tasks={taskState.tasks} />;
      case 'board':     return (
        <BoardPage
          searchQuery={searchQuery}
          filterColumn={filterColumn}
          taskState={taskState}
          projectState={projectState}
        />
      );
      case 'teams':    return <TeamsPage tasks={taskState.tasks} />;
      case 'alerts':   return <AlertsPage />;
      case 'messages': return <MessagesPage />;
      case 'settings': return <SettingsPage />;
      default:         return (
        <BoardPage
          searchQuery={searchQuery}
          filterColumn={filterColumn}
          taskState={taskState}
          projectState={projectState}
        />
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <Toaster position="top-right" toastOptions={{
        style: {
          fontFamily: 'Exo 2, sans-serif', fontSize: '13px',
          background: 'var(--bg-card)', color: 'var(--text-primary)',
          border: '1px solid var(--border)',
        },
      }} />

      <Sidebar
        activePage={activePage}
        onNavigate={(page) => { setActivePage(page); setSearchQuery(''); setFilterColumn(null); }}
        onLogout={handleLogout}
        unreadCount={unreadCount}
      />

      {SHOW_PANEL.includes(activePage) && (
        <ProjectsPanel
          activePage={activePage}
          taskCounts={taskCounts}
          projects={projectState.projects}
          onFilterColumn={(col) => { setFilterColumn(col); setActivePage('board'); }}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
        />
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  const { dark } = useTheme();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'Exo 2, sans-serif', fontSize: '13px' },
      }} />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/*"     element={<AppShell />} />
      </Routes>
    </>
  );
}
