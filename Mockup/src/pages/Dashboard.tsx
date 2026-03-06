import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Users,
  Car,
  CheckCircle,
  MapPin,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Wrench,
  Bell,
} from 'lucide-react';
import {
  getCurrentUser,
  getUserVehicle,
  getUserStudents,
  getTodayAttendance,
  getUserTransactions,
  getVehicleDocuments,
  getUnreadNotifications,
} from '../lib/storage';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    confirmedToday: 0,
    pendingToday: 0,
    vehicleRegistered: false,
    monthlyBalance: 0,
    unreadNotifications: 0,
    urgentAlerts: 0,
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const students = getUserStudents(user.id);
    const attendance = getTodayAttendance(user.id);
    const vehicle = getUserVehicle(user.id);

    const confirmed = attendance.filter((a) => a.confirmado).length;

    // Calculate monthly balance
    const currentMonth = new Date().toISOString().slice(0, 7);
    const transactions = getUserTransactions(user.id, currentMonth);
    const ingresos = transactions
      .filter((t) => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
    const gastos = transactions
      .filter((t) => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);
    const balance = ingresos - gastos;

    // Check urgent alerts (documents expiring soon)
    let urgentCount = 0;
    if (vehicle) {
      const documents = getVehicleDocuments().filter(
        (d) => d.vehicleId === vehicle.id
      );
      documents.forEach((doc) => {
        const daysUntilExpiry = Math.ceil(
          (new Date(doc.fechaVencimiento).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (daysUntilExpiry <= 15) {
          urgentCount++;
        }
      });
    }

    const unreadNotifs = getUnreadNotifications(user.id).length;

    setStats({
      totalStudents: students.length,
      confirmedToday: confirmed,
      pendingToday: students.length - attendance.length,
      vehicleRegistered: !!vehicle,
      monthlyBalance: balance,
      unreadNotifications: unreadNotifs,
      urgentAlerts: urgentCount,
    });
  }, [navigate]);

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600 capitalize">{today}</p>
      </div>

      {/* Alert if vehicle not registered */}
      {!stats.vehicleRegistered && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-900 mb-1">
              Vehículo no registrado
            </h3>
            <p className="text-sm text-yellow-800 mb-3">
              Registra tu vehículo para completar tu perfil
            </p>
            <button
              onClick={() => navigate('/vehicle')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
            >
              Registrar ahora
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.totalStudents}
          </div>
          <div className="text-sm text-gray-600">Estudiantes Activos</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.confirmedToday}
          </div>
          <div className="text-sm text-gray-600">Confirmados Hoy</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.pendingToday}
          </div>
          <div className="text-sm text-gray-600">Pendientes por confirmar</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.vehicleRegistered ? '1' : '0'}
          </div>
          <div className="text-sm text-gray-600">Vehículo Registrado</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.monthlyBalance.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Balance Mensual</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.unreadNotifications}
          </div>
          <div className="text-sm text-gray-600">Notificaciones No Leídas</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.urgentAlerts}
          </div>
          <div className="text-sm text-gray-600">Alertas Urgentes</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Gestionar Estudiantes</div>
              <div className="text-sm text-gray-500">Agregar o editar</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Ver Asistencia</div>
              <div className="text-sm text-gray-500">Confirmaciones</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/route')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Ver Ruta</div>
              <div className="text-sm text-gray-500">Mapa optimizado</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/vehicle')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Car className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Mi Vehículo</div>
              <div className="text-sm text-gray-500">Ver detalles</div>
            </div>
          </button>
        </div>
      </div>

      {/* Getting Started Guide */}
      {stats.totalStudents === 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-8 text-white">
          <h3 className="text-2xl font-semibold mb-4">
            ¡Bienvenido a RutaSmart! 🚀
          </h3>
          <p className="mb-6 text-blue-50">
            Para comenzar a optimizar tus rutas, sigue estos pasos:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <span>
                {stats.vehicleRegistered ? '✅' : '📝'} Registra tu vehículo
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <span>👨‍🎓 Agrega tus estudiantes con sus direcciones</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <span>✅ Confirma la asistencia diaria</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <span>🗺️ Visualiza tu ruta optimizada</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/students')}
            className="mt-6 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Agregar mi primer estudiante
          </button>
        </div>
      )}
    </div>
  );
}