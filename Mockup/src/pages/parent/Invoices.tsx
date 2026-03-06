import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import {
  getCurrentUser,
  getStudentsByAcudiente,
  getInvoicesByStudent,
} from '../../lib/storage';
import { Invoice, Student } from '../../lib/types';
import { StatusChip } from '../../components/StatusChip';

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [stats, setStats] = useState({
    pagadas: 0,
    pendientes: 0,
    vencidas: 0,
    total: 0,
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.tipo !== 'acudiente') {
      navigate('/login');
      return;
    }

    const userStudents = getStudentsByAcudiente(user.id);
    setStudents(userStudents);

    const allInvoices = userStudents.flatMap((student) =>
      getInvoicesByStudent(student.id)
    );
    setInvoices(allInvoices);

    setStats({
      pagadas: allInvoices.filter((i) => i.estado === 'pagado').length,
      pendientes: allInvoices.filter((i) => i.estado === 'pendiente').length,
      vencidas: allInvoices.filter((i) => i.estado === 'vencido').length,
      total: allInvoices.reduce((sum, i) => sum + i.monto, 0),
    });
  }, [navigate]);

  const filteredInvoices =
    selectedStudent === 'all'
      ? invoices
      : invoices.filter((i) => i.studentId === selectedStudent);

  const getInvoiceStatusConfig = (estado: Invoice['estado']) => {
    switch (estado) {
      case 'pagado':
        return {
          variant: 'success' as const,
          label: 'Pagado',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'pendiente':
        return {
          variant: 'warning' as const,
          label: 'Pendiente',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'vencido':
        return {
          variant: 'error' as const,
          label: 'Vencido',
          icon: <AlertTriangle className="w-3 h-3" />,
        };
    }
  };

  const getStudentName = (studentId: string) => {
    return students.find((s) => s.id === studentId)?.nombre || 'Desconocido';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Facturas y Pagos
        </h2>
        <p className="text-gray-600 mt-1">Historial de pagos del servicio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: '#34C759' }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.pagadas}</div>
              <div className="text-sm text-gray-600">Pagadas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 204, 0, 0.1)' }}
            >
              <Clock className="w-5 h-5" style={{ color: '#FFCC00' }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.pendientes}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)' }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: '#FF3B30' }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.vencidas}</div>
              <div className="text-sm text-gray-600">Vencidas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(42, 109, 244, 0.1)' }}
            >
              <CreditCard className="w-5 h-5" style={{ color: '#2A6DF4' }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      {students.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por estudiante
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estudiantes</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No hay facturas registradas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => {
            const statusConfig = getInvoiceStatusConfig(invoice.estado);
            const mesFormateado = new Date(invoice.mes + '-01').toLocaleDateString(
              'es-ES',
              {
                year: 'numeric',
                month: 'long',
              }
            );

            return (
              <div
                key={invoice.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(42, 109, 244, 0.1)' }}
                    >
                      <FileText className="w-6 h-6" style={{ color: '#2A6DF4' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Factura {mesFormateado}
                        </h3>
                        <StatusChip
                          variant={statusConfig.variant}
                          label={statusConfig.label}
                          icon={statusConfig.icon}
                        />
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Estudiante: {getStudentName(invoice.studentId)}</p>
                        <p>
                          Emitida:{' '}
                          {new Date(invoice.fechaEmision).toLocaleDateString('es-ES')}
                        </p>
                        <p>
                          Vence:{' '}
                          {new Date(invoice.fechaVencimiento).toLocaleDateString(
                            'es-ES'
                          )}
                        </p>
                        {invoice.fechaPago && (
                          <p>
                            Pagada:{' '}
                            {new Date(invoice.fechaPago).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-3">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${invoice.monto.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Monto</div>
                    </div>
                    <div className="flex gap-2">
                      {invoice.estado !== 'pagado' && (
                        <button
                          onClick={() =>
                            alert('Funcionalidad de pago en desarrollo')
                          }
                          className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                          style={{ backgroundColor: '#34C759' }}
                        >
                          Pagar ahora
                        </button>
                      )}
                      <button
                        onClick={() => alert('Descargando comprobante...')}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      {filteredInvoices.some((i) => i.estado === 'pendiente' || i.estado === 'vencido') && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">
                Tienes facturas pendientes
              </h4>
              <p className="text-sm text-yellow-800 mb-3">
                Recuerda pagar tus facturas antes de la fecha de vencimiento para
                evitar cargos adicionales.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
