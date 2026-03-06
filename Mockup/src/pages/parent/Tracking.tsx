import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Clock, CheckCircle, Navigation, Phone } from 'lucide-react';
import {
  getCurrentUser,
  getStudentsByAcudiente,
  getTodayBoarding,
} from '../../lib/storage';
import { Student, TripEvent } from '../../lib/types';
import { StatusChip } from '../../components/StatusChip';

export default function Tracking() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [tripEvents, setTripEvents] = useState<TripEvent[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.tipo !== 'acudiente') {
      navigate('/login');
      return;
    }

    const userStudents = getStudentsByAcudiente(user.id);
    setStudents(userStudents);
    
    if (userStudents.length > 0) {
      setSelectedStudent(userStudents[0]);
      loadTripEvents(userStudents[0].id);
    }
  }, [navigate]);

  const loadTripEvents = (studentId: string) => {
    const boarding = getTodayBoarding([studentId]);
    
    const events: TripEvent[] = boarding.flatMap((b) => {
      const events: TripEvent[] = [];
      
      if (b.horaAbordaje) {
        events.push({
          id: crypto.randomUUID(),
          studentId: b.studentId,
          tipo: 'abordo',
          hora: b.horaAbordaje,
          descripcion: 'Abordó el transporte',
        });
      }
      
      if (b.horaDescenso) {
        events.push({
          id: crypto.randomUUID(),
          studentId: b.studentId,
          tipo: 'descenso',
          hora: b.horaDescenso,
          descripcion: b.tipo === 'ida' ? 'Llegó al colegio' : 'Llegó a casa',
        });
      }
      
      return events;
    });

    setTripEvents(events);
  };

  const handleStudentChange = (student: Student) => {
    setSelectedStudent(student);
    loadTripEvents(student.id);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Seguimiento en Tiempo Real
        </h2>
        <p className="text-gray-600 mt-1">Ubicación y estado del transporte</p>
      </div>

      {/* Student Selector */}
      {students.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar estudiante
          </label>
          <select
            value={selectedStudent?.id || ''}
            onChange={(e) => {
              const student = students.find((s) => s.id === e.target.value);
              if (student) handleStudentChange(student);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {!selectedStudent ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No hay estudiantes para rastrear</p>
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
                    <p className="text-gray-600 mb-2">Mapa en tiempo real</p>
                    <p className="text-sm text-gray-500 max-w-md px-4">
                      En producción, aquí se mostraría la ubicación GPS del transporte
                      en tiempo real con Google Maps o Mapbox
                    </p>
                  </div>
                </div>

                {/* Bus marker simulation */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-3 shadow-lg"
                  style={{ backgroundColor: '#2A6DF4' }}
                >
                  <Navigation className="w-6 h-6 text-white" />
                </div>

                {/* Student location marker */}
                <div
                  className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg"
                  style={{ backgroundColor: '#34C759' }}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Distancia estimada
                    </h3>
                    <p className="text-sm text-gray-600">~2.5 km de distancia</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Tiempo estimado</h3>
                    <p className="text-sm text-gray-600">10-15 minutos</p>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center gap-2"
                    style={{ backgroundColor: '#34C759' }}
                    onClick={() => alert(`Llamando a ${selectedStudent.telefonoAcudiente}`)}
                  >
                    <Phone className="w-4 h-4" />
                    Llamar
                  </button>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                📍 Seguimiento en vivo
              </h4>
              <p className="text-sm text-blue-800">
                El conductor ha activado el seguimiento GPS. La ubicación se
                actualiza cada 30 segundos. Recibirás una notificación cuando esté a
                10 minutos de tu ubicación.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Eventos del día</h3>
              </div>

              <div className="p-6">
                {tripEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">
                      No hay eventos registrados aún
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tripEvents.map((event, index) => (
                      <div key={event.id} className="relative">
                        {index !== tripEvents.length - 1 && (
                          <div
                            className="absolute left-3 top-8 w-0.5 h-full"
                            style={{ backgroundColor: '#E5E7EB' }}
                          />
                        )}
                        <div className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                            style={{
                              backgroundColor:
                                event.tipo === 'abordo' ? '#34C759' : '#2A6DF4',
                            }}
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 pt-0.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {event.descripcion}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">{event.hora}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Student Info */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Información del estudiante
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Nombre:</span>
                  <p className="font-medium text-gray-900">{selectedStudent.nombre}</p>
                </div>
                {selectedStudent.grado && (
                  <div>
                    <span className="text-gray-600">Grado:</span>
                    <p className="font-medium text-gray-900">
                      {selectedStudent.grado}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Dirección:</span>
                  <p className="font-medium text-gray-900">
                    {selectedStudent.direccion}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Conductor:</span>
                  <p className="font-medium text-gray-900">
                    {selectedStudent.nombreAcudiente}
                  </p>
                  <p className="text-gray-600">{selectedStudent.telefonoAcudiente}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
