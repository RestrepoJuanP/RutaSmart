import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  MapPin,
  Navigation,
  Clock,
  Ruler,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';
import {
  getCurrentUser,
  getUserStudents,
  getTodayAttendance,
} from '../lib/storage';
import { Student, RouteStop } from '../lib/types';
import { optimizeRoute } from '../lib/routeOptimization';

export default function RouteMap() {
  const navigate = useNavigate();
  const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
  const [confirmedStudents, setConfirmedStudents] = useState<Student[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const allStudents = getUserStudents(user.id);
    const attendance = getTodayAttendance(user.id);

    // Filtrar solo estudiantes confirmados
    const confirmedIds = attendance
      .filter((a) => a.confirmado)
      .map((a) => a.studentId);

    const confirmed = allStudents.filter((s) => confirmedIds.includes(s.id));
    setConfirmedStudents(confirmed);

    if (confirmed.length > 0) {
      const optimized = optimizeRoute(confirmed);
      setRouteStops(optimized);

      const total = optimized.reduce((sum, stop) => sum + stop.distance, 0);
      setTotalDistance(total);
    }
  }, [navigate]);

  // Simular mapa con marcadores
  const startPoint = { lat: 4.6097, lng: -74.0817 };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Ruta Optimizada
        </h2>
        <p className="text-gray-600 mt-1">
          Ruta del día basada en confirmaciones de asistencia
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {routeStops.length}
              </div>
              <div className="text-sm text-gray-600">Paradas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Ruler className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {totalDistance.toFixed(1)} km
              </div>
              <div className="text-sm text-gray-600">Distancia total</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {routeStops.length > 0 ? routeStops[routeStops.length - 1].eta : '0m'}
              </div>
              <div className="text-sm text-gray-600">Tiempo estimado</div>
            </div>
          </div>
        </div>
      </div>

      {confirmedStudents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay estudiantes confirmados
          </h3>
          <p className="text-gray-600 mb-6">
            Primero confirma la asistencia de los estudiantes para generar la ruta
          </p>
          <button
            onClick={() => navigate('/attendance')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ir a Asistencia
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 h-[500px] relative">
                {/* Simulación de mapa */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Visualización del mapa</p>
                    <p className="text-sm text-gray-500 max-w-md">
                      En producción, aquí se mostraría un mapa interactivo con
                      Google Maps o Mapbox mostrando todas las paradas optimizadas
                    </p>
                  </div>
                </div>

                {/* Marcadores simulados */}
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    Inicio
                  </div>
                </div>

                {routeStops.slice(0, 3).map((stop, index) => (
                  <div
                    key={stop.student.id}
                    className="absolute bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                    style={{
                      top: `${20 + index * 25}%`,
                      left: `${30 + index * 15}%`,
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  <Navigation className="w-5 h-5" />
                  Iniciar Navegación
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <TrendingDown className="w-6 h-6" />
                <h3 className="font-semibold">Beneficios de la optimización</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-100">Ahorro estimado</div>
                  <div className="text-xl font-bold">~30%</div>
                  <div className="text-green-100">en combustible</div>
                </div>
                <div>
                  <div className="text-green-100">Tiempo ahorrado</div>
                  <div className="text-xl font-bold">~25%</div>
                  <div className="text-green-100">vs ruta manual</div>
                </div>
              </div>
            </div>
          </div>

          {/* Route List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Orden de paradas
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {/* Punto de inicio */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Punto de inicio
                      </div>
                      <div className="text-sm text-gray-500">0:00</div>
                    </div>
                  </div>
                </div>

                {/* Paradas */}
                {routeStops.map((stop) => (
                  <div key={stop.student.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {stop.order}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {stop.student.nombre}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {stop.student.direccion}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            {stop.distance.toFixed(2)} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ETA: {stop.eta}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
