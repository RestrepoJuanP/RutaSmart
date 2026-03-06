import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import {
  getCurrentUser,
  getUserTransactions,
  saveTransaction,
  deleteTransaction,
} from '../lib/storage';
import { Transaction, TransactionCategory, TransactionType } from '../lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Finances() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [stats, setStats] = useState({
    ingresos: 0,
    gastos: 0,
    balance: 0,
  });
  const [formData, setFormData] = useState({
    tipo: 'gasto' as TransactionType,
    categoria: 'combustible' as TransactionCategory,
    concepto: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const loadTransactions = () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const allTransactions = getUserTransactions(user.id, selectedMonth);
    setTransactions(allTransactions);

    const ingresos = allTransactions
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const gastos = allTransactions
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);

    setStats({
      ingresos,
      gastos,
      balance: ingresos - gastos,
    });
  };

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      tipo: formData.tipo,
      categoria: formData.categoria,
      concepto: formData.concepto,
      monto: parseFloat(formData.monto),
      fecha: formData.fecha,
    };

    saveTransaction(transaction);
    loadTransactions();
    handleCloseForm();
  };

  const handleDelete = (transactionId: string) => {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      deleteTransaction(transactionId);
      loadTransactions();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      tipo: 'gasto',
      categoria: 'combustible',
      concepto: '',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
    });
  };

  const categorias: { value: TransactionCategory; label: string }[] = [
    { value: 'pago_estudiante', label: 'Pago de Estudiante' },
    { value: 'combustible', label: 'Combustible' },
    { value: 'peaje', label: 'Peaje' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'seguro', label: 'Seguro' },
    { value: 'parqueadero', label: 'Parqueadero' },
    { value: 'otro', label: 'Otro' },
  ];

  const getCategoryLabel = (cat: TransactionCategory) => {
    return categorias.find(c => c.value === cat)?.label || cat;
  };

  const filteredTransactions = transactions.filter(
    t => filterCategory === 'todas' || t.categoria === filterCategory
  );

  // Datos para el gráfico
  const chartData = [
    {
      name: 'Ingresos',
      Monto: stats.ingresos,
      fill: '#34C759',
    },
    {
      name: 'Gastos',
      Monto: stats.gastos,
      fill: '#FF3B30',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Finanzas</h2>
          <p className="text-gray-600 mt-1">
            Control de ingresos y gastos operativos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: '#2A6DF4' }}
        >
          <Plus className="w-5 h-5" />
          Nueva Transacción
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Mes
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="w-4 h-4 inline mr-1" />
            Categoría
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: '#34C759' }} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Ingresos</div>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.ingresos.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)' }}
            >
              <TrendingDown className="w-5 h-5" style={{ color: '#FF3B30' }} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Gastos</div>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.gastos.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(42, 109, 244, 0.1)' }}
            >
              <DollarSign className="w-5 h-5" style={{ color: '#2A6DF4' }} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Balance</div>
              <div
                className={`text-2xl font-bold ${
                  stats.balance >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'
                }`}
              >
                ${stats.balance.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen del Mes
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="Monto" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Transacciones ({filteredTransactions.length})
          </h3>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay transacciones para este periodo</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          transaction.tipo === 'ingreso'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {transaction.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getCategoryLabel(transaction.categoria)}
                      </span>
                    </div>
                    <div className="font-medium text-gray-900">
                      {transaction.concepto}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`text-xl font-bold ${
                        transaction.tipo === 'ingreso'
                          ? 'text-[#34C759]'
                          : 'text-[#FF3B30]'
                      }`}
                    >
                      {transaction.tipo === 'ingreso' ? '+' : '-'}$
                      {transaction.monto.toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Nueva Transacción
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
                  Tipo *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'ingreso' })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.tipo === 'ingreso'
                        ? 'bg-[#34C759] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'gasto' })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.tipo === 'gasto'
                        ? 'bg-[#FF3B30] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Gasto
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoria: e.target.value as TransactionCategory,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categorias.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concepto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.concepto}
                  onChange={(e) =>
                    setFormData({ ...formData, concepto: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Tanque de gasolina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
