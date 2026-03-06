import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Car } from 'lucide-react';
import { getCurrentUser, getUserVehicle, saveVehicle } from '../lib/storage';
import { Vehicle } from '../lib/types';

export default function VehicleSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    capacidad: '',
  });
  const [existingVehicle, setExistingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const vehicle = getUserVehicle(user.id);
    if (vehicle) {
      setExistingVehicle(vehicle);
      setFormData({
        placa: vehicle.placa,
        modelo: vehicle.modelo,
        capacidad: vehicle.capacidad.toString(),
      });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    const vehicle: Vehicle = {
      id: existingVehicle?.id || crypto.randomUUID(),
      userId: user.id,
      placa: formData.placa.toUpperCase(),
      modelo: formData.modelo,
      capacidad: parseInt(formData.capacidad),
      createdAt: existingVehicle?.createdAt || new Date().toISOString(),
    };

    saveVehicle(vehicle);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {existingVehicle ? 'Editar Vehículo' : 'Registrar Vehículo'}
            </h2>
            <p className="text-gray-600">
              {existingVehicle
                ? 'Actualiza los datos de tu vehículo'
                : 'Ingresa los datos de tu vehículo de transporte escolar'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placa del vehículo
            </label>
            <input
              type="text"
              required
              value={formData.placa}
              onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
              placeholder="ABC123"
              maxLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo del vehículo
            </label>
            <input
              type="text"
              required
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Toyota Hiace 2018"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad de pasajeros
            </label>
            <input
              type="number"
              required
              min="1"
              max="50"
              value={formData.capacidad}
              onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 15"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {existingVehicle ? 'Actualizar' : 'Guardar'} Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
