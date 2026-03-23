import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: number;
  type: string;
  sender: string;
  timestamp: string;
  date: string;
  
  // 1. Location Details
  location: string;
  zone: string;
  camera_id: string;
  
  // 2. Crowd Data
  count: number;
  previous_count: number;
  limit: number;
  density: string;
  
  // 3. Status & Logic
  status: string;
  reason: string;
  suggested_action: string;
  
  // 4. Admin/Inbox Fields
  priority: string;
  inbox_status: string;
  action_taken: string;
  trend: string;
}

export const useNotifications = (token: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/notifications?token=${token}`);
    
    ws.onopen = () => setIsOnline(true);
    ws.onclose = () => setIsOnline(false);
    ws.onerror = () => setIsOnline(false);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          setNotifications(prev => [data.data, ...prev]);
        } else if (data.type === 'initial_notifications') {
          setNotifications(data.data.reverse());
        }
      } catch (e) {
        console.error("Error parsing notification", e);
      }
    };

    return () => ws.close();
  }, [token]);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  return { notifications, isOnline, clearNotifications };
};
