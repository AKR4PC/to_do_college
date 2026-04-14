import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications, markAllRead, markOneRead } from '../api/notifications';

export function useNotifications() {
  const [notifs, setNotifs] = useState([]);

  const load = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      setNotifs(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    load();
    // Poll every 2 minutes for new reminders
    const id = setInterval(load, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  const readAll = async () => {
    await markAllRead();
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const readOne = async (id) => {
    await markOneRead(id);
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return { notifs, unreadCount, readAll, readOne, reload: load };
}
