import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { Home, Users, CheckSquare, Map, Car, LogOut, DollarSign, Wrench, UserCheck, Bell } from 'lucide-react';
import { getCurrentUser, setCurrentUser, getUnreadNotifications } from '../lib/storage';
import { useEffect, useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
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
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/students', icon: Users, label: 'Estudiantes' },
    { path: '/attendance', icon: CheckSquare, label: 'Asistencia' },
    { path: '/boarding', icon: UserCheck, label: 'Abordaje' },
    { path: '/route', icon: Map, label: 'Ruta' },
    { path: '/finances', icon: DollarSign, label: 'Finanzas' },
    { path: '/maintenance', icon: Wrench, label: 'Mantenimiento' },
    { path: '/notifications', icon: Bell, label: 'Alertas', badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
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

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap relative ${
                    active
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}