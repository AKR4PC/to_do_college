import { useState } from 'react';

function isDemoMode() {
  const token = localStorage.getItem('token');
  return !token || token.startsWith('demo-token-');
}

export function useNotifications() {
  const [notifs] = useState([]);
  const unreadCount = 0;
  const readAll = () => {};
  const readOne = () => {};
  const reload  = () => {};

  // In demo mode return empty — no backend to poll
  if (isDemoMode()) return { notifs, unreadCount, readAll, readOne, reload };

  return { notifs, unreadCount, readAll, readOne, reload };
}
