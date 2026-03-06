import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import {
  getCurrentUser,
  getUserStudents,
  getTodayAttendance,
  saveAttendance,
  getStudentAttendanceToday,
} from '../lib/storage';
import { Student, AttendanceConfirmation } from '../lib/types';

interface StudentWithAttendance extends Student {
  attendance?: AttendanceConfirmation;
}

export default function Attendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [stats, setStats] = useState({
    confirmed: 0,
    notAttending: 0,
    pending: 0,
  });

  const loadAttendance = () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const allStudents = getUserStudents(user.id);
    const studentsWithAttendance = allStudents.map((student) => ({
      ...student,
      attendance: getStudentAttendanceToday(student.id),
    }));

    setStudents(studentsWithAttendance);

    const confirmed = studentsWithAttendance.filter(
      (s) => s.attendance?.confirmado === true
    ).length;
    const notAttending = studentsWithAttendance.filter(
      (s) => s.attendance?.confirmado === false
    ).length;
    const pending = studentsWithAttendance.filter((s) => !s.attendance).length;

    setStats({ confirmed, notAttending, pending });
  };

  useEffect(() => {
    loadAttendance();
  }, [navigate]);

  const handleConfirmation = (studentId: string, willAttend: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const attendance: AttendanceConfirmation = {
      id: crypto.randomUUID(),
      studentId,
      fecha: today,
      confirmado: willAttend,
      horaConfirmacion: now,
    };

    saveAttendance(attendance);
    loadAttendance();
  };

  const getStatusColor = (student: StudentWithAttendance) => {
    if (!student.attendance) return 'bg-gray-50 border-gray-200';
    if (student.attendance.confirmado) return 'bg-green-50 border-green-200';
    return 'bg-red-50 border-red-200';
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Confirmación de Asistencia
        </h2>
        <p className="text-gray-600 mt-1 capitalize">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.confirmed}
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.notAttending}
              </div>
              <div className="text-sm text-gray-600">No asistirán</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-900 mb-1">
            Sistema de confirmación diaria
          </h3>
          <p className="text-sm text-blue-800">
            En producción, los padres recibirían notificaciones automáticas para
            confirmar la asistencia. Por ahora, puedes simular las confirmaciones
            aquí.
          </p>
        </div>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay estudiantes registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Primero debes agregar estudiantes para confirmar asistencia
          </p>
          <button
            onClick={() => navigate('/students')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ir a Estudiantes
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {students.map((student) => (
              <div
                key={student.id}
                className={`p-6 ${getStatusColor(student)}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {student.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {student.direccion}
                    </p>
                    {student.attendance && (
                      <div className="flex items-center gap-2 text-sm">
                        {student.attendance.confirmado ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Confirmado - {student.attendance.horaConfirmacion}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            <XCircle className="w-3 h-3" />
                            No asistirá - {student.attendance.horaConfirmacion}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmation(student.id, true)}
                      disabled={student.attendance?.confirmado === true}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        student.attendance?.confirmado === true
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : 'bg-green-100 text-green-700 hover:bg-green-600 hover:text-white'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleConfirmation(student.id, false)}
                      disabled={student.attendance?.confirmado === false}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        student.attendance?.confirmado === false
                          ? 'bg-red-600 text-white cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
