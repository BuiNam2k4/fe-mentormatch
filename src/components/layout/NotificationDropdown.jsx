import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, RefreshCw } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();
    // Poll unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.code === 1000) {
        setUnreadCount(res.result);
      }
    } catch (error) {
      console.error('Failed to fetch unread count', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getMyNotifications(0, 10);
      if (res.code === 1000) {
        setNotifications(res.result?.content || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await notificationService.markAsRead(id);
      if (res.code === 1000) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.code === 1000) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id, { stopPropagation: () => {} });
    }
    
    setIsOpen(false);

    if (notification.type === 'BOOKING_CREATED' || notification.type === 'BOOKING_CANCELLED' || notification.type === 'BOOKING_COMPLETED') {
      navigate('/schedule');
    } else if (notification.type === 'PAYMENT_SUCCESS') {
      if (notification.title === 'Thanh toán thành công') {
        navigate('/my-bookings');
      } else {
        navigate('/schedule');
      }
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-slate-600 hover:text-[#372660] hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <h3 className="font-semibold text-slate-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-[#372660] hover:text-[#2b1d4c] flex items-center gap-1"
              >
                <Check className="h-3.5 w-3.5" />
                Đánh dấu đã đọc all
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8 text-slate-400">
                <RefreshCw className="h-5 w-5 animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex gap-3 p-4 border-b border-slate-50 cursor-pointer transition-colors ${
                      notification.isRead ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                    }`}
                  >
                    <div className="shrink-0 mt-1">
                      {notification.isRead ? (
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.isRead ? 'text-slate-600' : 'text-slate-800 font-medium'} mb-1`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs ${notification.isRead ? 'text-slate-500' : 'text-slate-600'} line-clamp-2`}>
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1.5">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-2">
                <Bell className="h-8 w-8 opacity-20" />
                <p className="text-sm">Bạn không có thông báo nào</p>
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
              <span className="text-xs text-slate-500">Hiển thị {notifications.length} thông báo mới nhất</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
