import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Bell,
  Wrench,
  DollarSign,
  MapPin,
  Clock,
  Info,
  UserCheck,
  Check,
  CheckCheck,
} from 'lucide-react';
import {
  getCurrentUser,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../lib/storage';
import { Notification, NotificationType } from '../lib/types';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    setNotifications(getUserNotifications(user.id));
  };

  useEffect(() => {
    loadNotifications();
  }, [navigate]);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    const user = getCurrentUser();
    if (user) {
      markAllNotificationsAsRead(user.id);
      loadNotifications();
    }
  };

  const getNotificationIcon = (tipo: NotificationType) => {
    switch (tipo) {
      case 'mantenimiento':
        return <Wrench className="w-5 h-5" />;
      case 'pago':
        return <DollarSign className="w-5 h-5" />;
      case 'ruta':
        return <MapPin className="w-5 h-5" />;
      case 'retraso':
        return <Clock className="w-5 h-5" />;
      case 'abordaje':
        return <UserCheck className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (tipo: NotificationType) => {
    switch (tipo) {
      case 'mantenimiento':
        return '#FFCC00';
      case 'pago':
        return '#34C759';
      case 'ruta':
        return '#2A6DF4';
      case 'retraso':
        return '#FF3B30';
      case 'abordaje':
        return '#34C759';
      default:
        return '#6B7280';
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === 'all' ? true : !n.leida
  );

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Notificaciones
          </h2>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0
              ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
              : 'No tienes notificaciones sin leer'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <CheckCheck className="w-5 h-5" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={
            filter === 'all' ? { backgroundColor: '#2A6DF4' } : {}
          }
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'unread'
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={
            filter === 'unread' ? { backgroundColor: '#2A6DF4' } : {}
          }
        >
          No leídas ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'unread'
              ? 'No tienes notificaciones sin leer'
              : 'No hay notificaciones'}
          </h3>
          <p className="text-gray-600">
            {filter === 'unread'
              ? 'Todas tus notificaciones están al día'
              : 'Recibirás notificaciones sobre eventos importantes'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl shadow-sm border transition-all ${
                notification.leida
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-300'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                    style={{
                      backgroundColor: getNotificationColor(notification.tipo),
                    }}
                  >
                    {getNotificationIcon(notification.tipo)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className={`font-semibold ${
                          notification.leida ? 'text-gray-700' : 'text-gray-900'
                        }`}
                      >
                        {notification.titulo}
                      </h3>
                      {!notification.leida && (
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ backgroundColor: '#2A6DF4' }}
                        />
                      )}
                    </div>
                    <p
                      className={`text-sm mb-2 ${
                        notification.leida ? 'text-gray-500' : 'text-gray-700'
                      }`}
                    >
                      {notification.descripcion}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {new Date(notification.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>{notification.hora}</span>
                    </div>
                  </div>

                  {!notification.leida && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                      <Check className="w-4 h-4" />
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
