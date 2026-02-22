import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, Users, Calendar } from 'lucide-react';
import {
  getCurrentUser,
  getStudentsByAcudiente,
} from '../../lib/storage';

export default function ParentProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.tipo !== 'acudiente') {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    const students = getStudentsByAcudiente(currentUser.id);
    setStudentCount(students.length);
  }, [navigate]);

  if (!user) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">Mi Perfil</h2>
        <p className="text-gray-600 mt-1">Información de tu cuenta</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div
          className="h-24"
          style={{
            background: 'linear-gradient(135deg, #2A6DF4 0%, #1e4db8 100%)',
          }}
        />
        <div className="px-6 pb-6">
          <div className="flex items-start gap-4 -mt-12 mb-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg"
              style={{ backgroundColor: '#2A6DF4' }}
            >
              {user.nombre.charAt(0)}
            </div>
            <div className="flex-1 pt-14">
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                {user.nombre}
              </h3>
              <p className="text-gray-600">Padre/Madre de Familia</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(42, 109, 244, 0.1)' }}
              >
                <Mail className="w-5 h-5" style={{ color: '#2A6DF4' }} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Correo Electrónico</div>
                <div className="font-medium text-gray-900">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
              >
                <Phone className="w-5 h-5" style={{ color: '#34C759' }} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Teléfono</div>
                <div className="font-medium text-gray-900">{user.telefono}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 204, 0, 0.1)' }}
              >
                <Users className="w-5 h-5" style={{ color: '#FFCC00' }} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Hijos Registrados</div>
                <div className="font-medium text-gray-900">
                  {studentCount} {studentCount === 1 ? 'hijo' : 'hijos'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)' }}
              >
                <Calendar className="w-5 h-5" style={{ color: '#6B7280' }} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Miembro desde</div>
                <div className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Acerca de RutaSmart
        </h4>
        <p className="text-sm text-blue-800 mb-3">
          RutaSmart es una plataforma integral para la gestión de transporte escolar.
          Mantente informado sobre el recorrido de tus hijos en tiempo real.
        </p>
        <div className="text-sm text-blue-800">
          <strong>Versión:</strong> 1.0.0 (MVP)
        </div>
      </div>
    </div>
  );
}
