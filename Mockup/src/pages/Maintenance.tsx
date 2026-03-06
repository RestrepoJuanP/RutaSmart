import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus,
  Wrench,
  AlertTriangle,
  Calendar,
  FileText,
  X,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  getCurrentUser,
  getUserVehicle,
  getVehicleMaintenance,
  saveMaintenance,
  getDocumentsByVehicle,
  saveVehicleDocument,
} from '../lib/storage';
import { Maintenance as MaintenanceType, VehicleDocument } from '../lib/types';
import { StatusChip } from '../components/StatusChip';

export default function Maintenance() {
  const navigate = useNavigate();
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceType[]>([]);
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [vehicleId, setVehicleId] = useState<string>('');
  
  const [maintenanceForm, setMaintenanceForm] = useState({
    tipo: 'aceite' as MaintenanceType['tipo'],
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    kilometraje: '',
    costo: '',
    taller: '',
  });

  const [documentForm, setDocumentForm] = useState({
    tipo: 'soat' as VehicleDocument['tipo'],
    fechaVencimiento: '',
    descripcion: '',
  });

  const loadData = () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const vehicle = getUserVehicle(user.id);
    if (!vehicle) {
      navigate('/vehicle');
      return;
    }

    setVehicleId(vehicle.id);
    setMaintenanceRecords(getVehicleMaintenance(vehicle.id));
    setDocuments(getDocumentsByVehicle(vehicle.id));
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maintenance: MaintenanceType = {
      id: crypto.randomUUID(),
      vehicleId,
      tipo: maintenanceForm.tipo,
      descripcion: maintenanceForm.descripcion,
      fecha: maintenanceForm.fecha,
      kilometraje: parseInt(maintenanceForm.kilometraje),
      costo: parseFloat(maintenanceForm.costo),
      taller: maintenanceForm.taller,
    };

    saveMaintenance(maintenance);
    loadData();
    setShowMaintenanceForm(false);
    setMaintenanceForm({
      tipo: 'aceite',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      kilometraje: '',
      costo: '',
      taller: '',
    });
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const document: VehicleDocument = {
      id: crypto.randomUUID(),
      vehicleId,
      tipo: documentForm.tipo,
      fechaVencimiento: documentForm.fechaVencimiento,
      descripcion: documentForm.descripcion,
    };

    saveVehicleDocument(document);
    loadData();
    setShowDocumentForm(false);
    setDocumentForm({
      tipo: 'soat',
      fechaVencimiento: '',
      descripcion: '',
    });
  };

  const getDocumentStatus = (fechaVencimiento: string) => {
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffDays = Math.ceil((vencimiento.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { variant: 'error' as const, label: 'Vencido', days: Math.abs(diffDays) };
    } else if (diffDays <= 15) {
      return { variant: 'warning' as const, label: 'Por vencer', days: diffDays };
    } else if (diffDays <= 30) {
      return { variant: 'warning' as const, label: 'Próximo a vencer', days: diffDays };
    } else {
      return { variant: 'success' as const, label: 'Al día', days: diffDays };
    }
  };

  const maintenanceTypes = [
    { value: 'aceite', label: 'Cambio de aceite' },
    { value: 'revision', label: 'Revisión general' },
    { value: 'llantas', label: 'Llantas' },
    { value: 'frenos', label: 'Frenos' },
    { value: 'otro', label: 'Otro' },
  ];

  const documentTypes = [
    { value: 'soat', label: 'SOAT' },
    { value: 'tecnomecanica', label: 'Tecnomecánica' },
    { value: 'seguro', label: 'Seguro' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Vehículo y Mantenimiento
        </h2>
        <p className="text-gray-600 mt-1">
          Control de mantenimientos y documentos del vehículo
        </p>
      </div>

      {/* Document Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {documents.length === 0 ? (
          <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">
                Documentos no registrados
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                Registra los documentos de tu vehículo para recibir alertas de vencimiento
              </p>
              <button
                onClick={() => setShowDocumentForm(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
              >
                Registrar documentos
              </button>
            </div>
          </div>
        ) : (
          documents.map((doc) => {
            const status = getDocumentStatus(doc.fechaVencimiento);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">
                      {documentTypes.find(t => t.value === doc.tipo)?.label}
                    </h3>
                  </div>
                  <StatusChip
                    variant={status.variant}
                    label={status.label}
                    size="sm"
                  />
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Vence:{' '}
                  {new Date(doc.fechaVencimiento).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {status.days} días restantes
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowMaintenanceForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: '#2A6DF4' }}
        >
          <Plus className="w-5 h-5" />
          Registrar Mantenimiento
        </button>
        <button
          onClick={() => setShowDocumentForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Documento
        </button>
      </div>

      {/* Maintenance History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Historial de Mantenimientos ({maintenanceRecords.length})
          </h3>
        </div>

        {maintenanceRecords.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No hay mantenimientos registrados</p>
            <p className="text-sm text-gray-500">
              Lleva un registro de todos los mantenimientos de tu vehículo
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {maintenanceRecords.map((record) => (
              <div
                key={record.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: 'rgba(42, 109, 244, 0.1)',
                          color: '#2A6DF4',
                        }}
                      >
                        {maintenanceTypes.find(t => t.value === record.tipo)?.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {record.kilometraje.toLocaleString()} km
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {record.descripcion}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(record.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      {record.taller && (
                        <div className="text-gray-500">Taller: {record.taller}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${record.costo.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Costo</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance Form Modal */}
      {showMaintenanceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Registrar Mantenimiento
              </h3>
              <button
                onClick={() => setShowMaintenanceForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMaintenanceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de mantenimiento *
                </label>
                <select
                  required
                  value={maintenanceForm.tipo}
                  onChange={(e) =>
                    setMaintenanceForm({
                      ...maintenanceForm,
                      tipo: e.target.value as MaintenanceType['tipo'],
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {maintenanceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  required
                  value={maintenanceForm.descripcion}
                  onChange={(e) =>
                    setMaintenanceForm({
                      ...maintenanceForm,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Cambio de aceite Mobil 5W-30"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={maintenanceForm.fecha}
                    onChange={(e) =>
                      setMaintenanceForm({
                        ...maintenanceForm,
                        fecha: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometraje *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={maintenanceForm.kilometraje}
                    onChange={(e) =>
                      setMaintenanceForm({
                        ...maintenanceForm,
                        kilometraje: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="150000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={maintenanceForm.costo}
                  onChange={(e) =>
                    setMaintenanceForm({
                      ...maintenanceForm,
                      costo: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taller
                </label>
                <input
                  type="text"
                  value={maintenanceForm.taller}
                  onChange={(e) =>
                    setMaintenanceForm({
                      ...maintenanceForm,
                      taller: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre del taller"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: '#2A6DF4' }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Form Modal */}
      {showDocumentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Agregar Documento
              </h3>
              <button
                onClick={() => setShowDocumentForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDocumentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de documento *
                </label>
                <select
                  required
                  value={documentForm.tipo}
                  onChange={(e) =>
                    setDocumentForm({
                      ...documentForm,
                      tipo: e.target.value as VehicleDocument['tipo'],
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de vencimiento *
                </label>
                <input
                  type="date"
                  required
                  value={documentForm.fechaVencimiento}
                  onChange={(e) =>
                    setDocumentForm({
                      ...documentForm,
                      fechaVencimiento: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={documentForm.descripcion}
                  onChange={(e) =>
                    setDocumentForm({
                      ...documentForm,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notas adicionales (opcional)"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDocumentForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: '#2A6DF4' }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
