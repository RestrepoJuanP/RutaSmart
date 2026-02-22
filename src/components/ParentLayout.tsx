import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { Home, MapPin, FileText, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { getCurrentUser, setCurrentUser, getUnreadNotifications } from '../lib/storage';
import { useEffect, useState } from 'react';

export default function ParentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.tipo !== 'acudiente') {
      navigate('/login');
    } else {
      setUserName(user.nombre);
      const unread = getUnreadNotifications(user.id);
      setUnreadCount(unread.length);
    }
  }, [navigate]);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/parent', icon: Home, label: 'Inicio' },
    { path: '/parent/tracking', icon: MapPin, label: 'Seguimiento' },
    { path: '/parent/invoices', icon: FileText, label: 'Facturas' },
    { path: '/parent/notifications', icon: Bell, label: 'Alertas' },
    { path: '/parent/profile', icon: UserIcon, label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: '#2A6DF4' }}
              >
                RS
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">RutaSmart</h1>
                <p className="text-sm text-gray-500">Hola, {userName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  active
                    ? 'text-[#2A6DF4]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {item.path === '/parent/notifications' && unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
                      style={{ backgroundColor: '#FF3B30', fontSize: '10px' }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Navigation (Desktop) */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:top-16">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-blue-50 text-[#2A6DF4]'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="mr-3 flex-shrink-0 h-6 w-6" />
                      {item.path === '/parent/notifications' && unreadCount > 0 && (
                        <span
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                          style={{ backgroundColor: '#FF3B30' }}
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-64 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
