import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle,
  UserCheck,
  UserX,
  Users,
  ArrowDown,
  ArrowUp,
  Clock,
} from 'lucide-react';
import {
  getCurrentUser,
  getUserStudents,
  getTodayAttendance,
  getTodayBoarding,
  saveBoardingRecord,
} from '../lib/storage';
import { Student, BoardingRecord, BoardingStatus } from '../lib/types';
import { StatusChip } from '../components/StatusChip';

interface StudentWithBoarding extends Student {
  boardingIda?: BoardingRecord;
  boardingRegreso?: BoardingRecord;
}

export default function BoardingVerification() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentWithBoarding[]>([]);
  const [activeTrip, setActiveTrip] = useState<'ida' | 'regreso'>('ida');
  const [stats, setStats] = useState({
    total: 0,
    abordo: 0,
    descendio: 0,
    ausente: 0,
    pendiente: 0,
  });

  const loadBoardingData = () => {
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
    
    const confirmedStudents = allStudents.filter((s) =>
      confirmedIds.includes(s.id)
    );

    const boarding = getTodayBoarding(confirmedIds);
    
    const studentsWithBoarding = confirmedStudents.map((student) => ({
      ...student,
      boardingIda: boarding.find(
        (b) => b.studentId === student.id && b.tipo === 'ida'
      ),
      boardingRegreso: boarding.find(
        (b) => b.studentId === student.id && b.tipo === 'regreso'
      ),
    }));

    setStudents(studentsWithBoarding);

    // Calculate stats for active trip
    const relevantBoarding = studentsWithBoarding.map((s) =>
      activeTrip === 'ida' ? s.boardingIda : s.boardingRegreso
    );

    setStats({
      total: studentsWithBoarding.length,
      abordo: relevantBoarding.filter((b) => b?.status === 'abordo').length,
      descendio: relevantBoarding.filter((b) => b?.status === 'descendio').length,
      ausente: relevantBoarding.filter((b) => b?.status === 'ausente').length,
      pendiente: relevantBoarding.filter((b) => !b || b.status === 'pendiente')
        .length,
    });
  };

  useEffect(() => {
    loadBoardingData();
  }, [activeTrip, navigate]);

  const handleBoardingAction = (
    studentId: string,
    status: BoardingStatus,
    tipo: 'ida' | 'regreso'
  ) => {
    const now = new Date();
    const hora = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const record: BoardingRecord = {
      id: crypto.randomUUID(),
      studentId,
      fecha: now.toISOString().split('T')[0],
      tipo,
      status,
      ...(status === 'abordo' && { horaAbordaje: hora }),
      ...(status === 'descendio' && { horaDescenso: hora }),
    };

    saveBoardingRecord(record);
    loadBoardingData();
  };

  const getBoardingStatus = (student: StudentWithBoarding, tipo: 'ida' | 'regreso') => {
    const boarding = tipo === 'ida' ? student.boardingIda : student.boardingRegreso;
    if (!boarding) return 'pendiente';
    return boarding.status;
  };

  const getStatusVariant = (status: BoardingStatus) => {
    switch (status) {
      case 'abordo':
        return 'success';
      case 'descendio':
        return 'info';
      case 'ausente':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: BoardingStatus) => {
    switch (status) {
      case 'abordo':
        return 'Abordó';
      case 'descendio':
        return 'Descendió';
      case 'ausente':
        return 'Ausente';
      default:
        return 'Pendiente';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Verificación de Abordaje
        </h2>
        <p className="text-gray-600 mt-1">
          Registra el abordaje y descenso de los estudiantes
        </p>
      </div>

      {/* Trip Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTrip('ida')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTrip === 'ida'
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={
            activeTrip === 'ida'
              ? { backgroundColor: '#2A6DF4' }
              : {}
          }
        >
          <ArrowUp className="w-5 h-5" />
          Ruta de Ida (Mañana)
        </button>
        <button
          onClick={() => setActiveTrip('regreso')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            activeTrip === 'regreso'
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={
            activeTrip === 'regreso'
              ? { backgroundColor: '#2A6DF4' }
              : {}
          }
        >
          <ArrowDown className="w-5 h-5" />
          Ruta de Regreso (Tarde)
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-4 h-4" style={{ color: '#34C759' }} />
            <span className="text-sm text-gray-600">Abordó</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#34C759' }}>
            {stats.abordo}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDown className="w-4 h-4" style={{ color: '#2A6DF4' }} />
            <span className="text-sm text-gray-600">Descendió</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#2A6DF4' }}>
            {stats.descendio}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <UserX className="w-4 h-4" style={{ color: '#FF3B30' }} />
            <span className="text-sm text-gray-600">Ausente</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#FF3B30' }}>
            {stats.ausente}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4" style={{ color: '#FFCC00' }} />
            <span className="text-sm text-gray-600">Pendiente</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#B8860B' }}>
            {stats.pendiente}
          </div>
        </div>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay estudiantes confirmados
          </h3>
          <p className="text-gray-600 mb-6">
            Primero confirma la asistencia de los estudiantes
          </p>
          <button
            onClick={() => navigate('/attendance')}
            className="px-6 py-3 text-white rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#2A6DF4' }}
          >
            Ir a Confirmación de Asistencia
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {students.map((student) => {
              const status = getBoardingStatus(student, activeTrip);
              const boarding =
                activeTrip === 'ida' ? student.boardingIda : student.boardingRegreso;

              return (
                <div
                  key={student.id}
                  className={`p-6 transition-colors ${
                    status === 'descendio' ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: '#2A6DF4' }}
                      >
                        {student.nombre.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {student.nombre}
                          </h3>
                          <StatusChip
                            variant={getStatusVariant(status)}
                            label={getStatusLabel(status)}
                            size="sm"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {student.direccion}
                        </p>
                        {boarding && (
                          <div className="text-xs text-gray-500">
                            {boarding.horaAbordaje && (
                              <span>Abordó: {boarding.horaAbordaje}</span>
                            )}
                            {boarding.horaAbordaje && boarding.horaDescenso && (
                              <span className="mx-2">•</span>
                            )}
                            {boarding.horaDescenso && (
                              <span>Descendió: {boarding.horaDescenso}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {status === 'pendiente' && (
                        <>
                          <button
                            onClick={() =>
                              handleBoardingAction(student.id, 'abordo', activeTrip)
                            }
                            className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                            style={{ backgroundColor: '#34C759' }}
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleBoardingAction(student.id, 'ausente', activeTrip)
                            }
                            className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                            style={{ backgroundColor: '#FF3B30' }}
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {status === 'abordo' && (
                        <button
                          onClick={() =>
                            handleBoardingAction(student.id, 'descendio', activeTrip)
                          }
                          className="px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center gap-2"
                          style={{ backgroundColor: '#2A6DF4' }}
                        >
                          <ArrowDown className="w-5 h-5" />
                          <span>Descendió</span>
                        </button>
                      )}
                      {(status === 'descendio' || status === 'ausente') && (
                        <button
                          onClick={() =>
                            handleBoardingAction(student.id, 'pendiente', activeTrip)
                          }
                          className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Revertir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info */}
      {students.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instrucciones:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Abordó:</strong> Marca cuando el estudiante suba al vehículo
            </li>
            <li>
              • <strong>Descendió:</strong> Marca cuando llegue a su destino (colegio o casa)
            </li>
            <li>
              • <strong>Ausente:</strong> Si el estudiante confirmó pero no se presentó
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
