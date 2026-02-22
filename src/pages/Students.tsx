import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Edit2, Trash2, User, Phone, MapPin, X } from 'lucide-react';
import {
  getCurrentUser,
  getUserStudents,
  saveStudent,
  deleteStudent,
} from '../lib/storage';
import { Student } from '../lib/types';
import { geocodeAddress } from '../lib/routeOptimization';

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefonoAcudiente: '',
    nombreAcudiente: '',
  });

  const loadStudents = () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setStudents(getUserStudents(user.id));
  };

  useEffect(() => {
    loadStudents();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    // Geocodificar la dirección
    const coords = await geocodeAddress(formData.direccion);

    const student: Student = {
      id: editingStudent?.id || crypto.randomUUID(),
      userId: user.id,
      nombre: formData.nombre,
      direccion: formData.direccion,
      lat: coords.lat,
      lng: coords.lng,
      telefonoAcudiente: formData.telefonoAcudiente,
      nombreAcudiente: formData.nombreAcudiente,
      activo: true,
      createdAt: editingStudent?.createdAt || new Date().toISOString(),
    };

    saveStudent(student);
    loadStudents();
    handleCloseForm();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nombre: student.nombre,
      direccion: student.direccion,
      telefonoAcudiente: student.telefonoAcudiente,
      nombreAcudiente: student.nombreAcudiente,
    });
    setShowForm(true);
  };

  const handleDelete = (studentId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      deleteStudent(studentId);
      loadStudents();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFormData({
      nombre: '',
      direccion: '',
      telefonoAcudiente: '',
      nombreAcudiente: '',
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Estudiantes</h2>
          <p className="text-gray-600 mt-1">
            Gestiona los estudiantes de tu ruta
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Estudiante
        </button>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay estudiantes registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza agregando estudiantes a tu ruta
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Agregar primer estudiante
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-3">
                {student.nombre}
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{student.direccion}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span>{student.nombreAcudiente}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{student.telefonoAcudiente}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingStudent ? 'Editar Estudiante' : 'Agregar Estudiante'}
              </h3>
              <button
                onClick={handleCloseForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del estudiante *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: María Rodríguez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección completa *
                </label>
                <textarea
                  required
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Calle 45 #23-12, Apartamento 301"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del acudiente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombreAcudiente}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreAcudiente: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Carlos Rodríguez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono del acudiente *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefonoAcudiente}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefonoAcudiente: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3001234567"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingStudent ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
