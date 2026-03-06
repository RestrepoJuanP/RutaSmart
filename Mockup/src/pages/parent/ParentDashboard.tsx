import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  MapPin,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Phone,
  ArrowRight,
} from 'lucide-react';
import {
  getCurrentUser,
  getStudentsByAcudiente,
  getStudentAttendanceToday,
  getTodayBoarding,
  getInvoicesByStudent,
} from '../../lib/storage';
import { Student, Invoice } from '../../lib/types';
import { StatusChip } from '../../components/StatusChip';

interface StudentWithStatus extends Student {
  tripStatus: 'pendiente' | 'en_ruta' | 'abordo' | 'completado' | 'no_asiste';
  invoiceStatus?: 'pagado' | 'pendiente' | 'vencido';
}

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentWithStatus[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.tipo !== 'acudiente') {
      navigate('/login');
      return;
    }

    const userStudents = getStudentsByAcudiente(user.id);
    
    const studentsWithStatus: StudentWithStatus[] = userStudents.map((student) => {
      const attendance = getStudentAttendanceToday(student.id);
      const boarding = getTodayBoarding([student.id]);
      const invoices = getInvoicesByStudent(student.id);
      
      let tripStatus: StudentWithStatus['tripStatus'] = 'pendiente';
      
      if (attendance && !attendance.confirmado) {
        tripStatus = 'no_asiste';
      } else if (boarding.length > 0) {
        const latestBoarding = boarding[0];
        if (latestBoarding.status === 'descendio') {
          tripStatus = 'completado';
        } else if (latestBoarding.status === 'abordo') {
          tripStatus = 'abordo';
        } else if (latestBoarding.status === 'pendiente') {
          tripStatus = 'en_ruta';
        }
      } else if (attendance && attendance.confirmado) {
        tripStatus = 'en_ruta';
      }

      // Check invoice status (most recent)
      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentInvoice = invoices.find(inv => inv.mes === currentMonth);
      
      return {
        ...student,
        tripStatus,
        invoiceStatus: currentInvoice?.estado,
      };
    });

    setStudents(studentsWithStatus);
  }, [navigate]);

  const getTripStatusConfig = (status: StudentWithStatus['tripStatus']) => {
    switch (status) {
      case 'en_ruta':
        return {
          variant: 'warning' as const,
          label: 'En ruta',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'abordo':
        return {
          variant: 'success' as const,
          label: 'Abordó',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'completado':
        return {
          variant: 'info' as const,
          label: 'Llegó a destino',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'no_asiste':
        return {
          variant: 'neutral' as const,
          label: 'No asiste',
          icon: <AlertCircle className="w-3 h-3" />,
        };
      default:
        return {
          variant: 'neutral' as const,
          label: 'Pendiente',
          icon: <Clock className="w-3 h-3" />,
        };
    }
  };

  const getInvoiceStatusConfig = (status?: 'pagado' | 'pendiente' | 'vencido') => {
    switch (status) {
      case 'pagado':
        return { variant: 'success' as const, label: 'Pagado' };
      case 'pendiente':
        return { variant: 'warning' as const, label: 'Pendiente' };
      case 'vencido':
        return { variant: 'error' as const, label: 'Vencido' };
      default:
        return { variant: 'neutral' as const, label: 'Sin factura' };
    }
  };

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
        <h2 className="text-3xl font-semibold text-gray-900">Inicio</h2>
        <p className="text-gray-600 mt-1 capitalize">{today}</p>
      </div>

      {/* Students Cards */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay estudiantes registrados
          </h3>
          <p className="text-gray-600">
            Contacta al conductor para vincular a tus hijos
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {students.map((student) => {
            const tripConfig = getTripStatusConfig(student.tripStatus);
            const invoiceConfig = getInvoiceStatusConfig(student.invoiceStatus);
            
            return (
              <div
                key={student.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Student Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                      style={{ backgroundColor: '#2A6DF4' }}
                    >
                      {student.nombre.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {student.nombre}
                        </h3>
                        <StatusChip
                          variant={tripConfig.variant}
                          label={tripConfig.label}
                          icon={tripConfig.icon}
                        />
                      </div>
                      {student.grado && student.colegio && (
                        <p className="text-sm text-gray-600">
                          {student.grado} • {student.colegio}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {student.direccion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  {/* Tracking */}
                  <button
                    onClick={() => navigate('/parent/tracking')}
                    className="p-6 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(42, 109, 244, 0.1)' }}
                        >
                          <MapPin className="w-5 h-5" style={{ color: '#2A6DF4' }} />
                        </div>
                        <span className="font-medium text-gray-900">Seguimiento</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Ver ubicación en tiempo real
                    </p>
                  </button>

                  {/* Invoices */}
                  <button
                    onClick={() => navigate('/parent/invoices')}
                    className="p-6 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor:
                              student.invoiceStatus === 'pagado'
                                ? 'rgba(52, 199, 89, 0.1)'
                                : student.invoiceStatus === 'vencido'
                                ? 'rgba(255, 59, 48, 0.1)'
                                : 'rgba(255, 204, 0, 0.1)',
                          }}
                        >
                          <FileText
                            className="w-5 h-5"
                            style={{
                              color:
                                student.invoiceStatus === 'pagado'
                                  ? '#34C759'
                                  : student.invoiceStatus === 'vencido'
                                  ? '#FF3B30'
                                  : '#FFCC00',
                            }}
                          />
                        </div>
                        <span className="font-medium text-gray-900">Factura del mes</span>
                      </div>
                      <StatusChip
                        variant={invoiceConfig.variant}
                        label={invoiceConfig.label}
                        size="sm"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Ver detalles y pagos</p>
                  </button>

                  {/* Contact */}
                  <button
                    onClick={() => alert('Funcionalidad de contacto próximamente')}
                    className="p-6 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
                        >
                          <Phone className="w-5 h-5" style={{ color: '#34C759' }} />
                        </div>
                        <span className="font-medium text-gray-900">Contactar</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Llamar al conductor: {student.telefonoAcudiente}
                    </p>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Confirma la asistencia</h4>
              <p className="text-sm text-blue-800">
                Recuerda confirmar diariamente si tu hijo usará el servicio
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">Mantente informado</h4>
              <p className="text-sm text-green-800">
                Recibirás notificaciones sobre la ubicación y novedades del servicio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
