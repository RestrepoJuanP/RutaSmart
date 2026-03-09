import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Clock,
  AlertCircle,
  MessageSquare,
  Receipt,
} from 'lucide-react';
import {
  getCurrentUser,
  getUserTransactions,
  saveTransaction,
  deleteTransaction,
  getConductorComprobantes,
  updateComprobanteEstado,
} from '../lib/storage';
import {
  Transaction,
  TransactionCategory,
  TransactionType,
  ComprobantePago,
  EstadoComprobante,
} from '../lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ── Helpers ─────────────────────────────────────────────────────────────────

function mesPagoDisplay(mes: string): string {
  if (!mes) return 'â€”';
  try {
    const [year, month] = mes.split('-');
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    return `${meses[parseInt(month, 10) - 1]} ${year}`;
  } catch {
    return mes;
  }
}

function EstadoBadge({ estado }: { estado: EstadoComprobante }) {
  const styles: Record<EstadoComprobante, string> = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    aprobado: 'bg-green-100 text-green-700',
    rechazado: 'bg-red-100 text-red-700',
  };
  const labels: Record<EstadoComprobante, string> = {
    pendiente: 'Pendiente',
    aprobado: 'Aprobado',
    rechazado: 'No recibido',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${styles[estado]}`}
    >
      {estado === 'pendiente' && <Clock className="w-3 h-3" />}
      {estado === 'aprobado' && <CheckCircle className="w-3 h-3" />}
      {estado === 'rechazado' && <XCircle className="w-3 h-3" />}
      {labels[estado]}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Finances() {
  const navigate = useNavigate();

  // ── Tab ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'transacciones' | 'comprobantes'>('transacciones');

  // ── Transacciones ────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [stats, setStats] = useState({ ingresos: 0, gastos: 0, balance: 0 });
  const [formData, setFormData] = useState({
    tipo: 'gasto' as TransactionType,
    categoria: 'combustible' as TransactionCategory,
    concepto: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  // ── Comprobantes ─────────────────────────────────────────────────────────
  const [comprobantes, setComprobantes] = useState<ComprobantePago[]>([]);
  const [filterEstado, setFilterEstado] = useState<'todos' | EstadoComprobante>('todos');
  const [filterMesComp, setFilterMesComp] = useState(''); // '' = todos los meses
  const [selectedComp, setSelectedComp] = useState<ComprobantePago | null>(null);
  const [showArchivoModal, setShowArchivoModal] = useState(false);
  const [showValidarModal, setShowValidarModal] = useState(false);
  const [validarAction, setValidarAction] = useState<'aprobado' | 'rechazado' | null>(null);
  const [comentario, setComentario] = useState('');
  const [compStats, setCompStats] = useState({
    totalAprobado: 0,
    totalPendiente: 0,
    cantidadPendientes: 0,
    totalAcumulado: 0,
  });

  // ── Loaders ──────────────────────────────────────────────────────────────

  const loadTransactions = () => {
    const user = getCurrentUser();
    if (!user) { navigate('/login'); return; }
    const all = getUserTransactions(user.id, selectedMonth);
    setTransactions(all);
    const ingresos = all.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0);
    const gastos = all.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0);
    setStats({ ingresos, gastos, balance: ingresos - gastos });
  };

  const loadComprobantes = () => {
    const user = getCurrentUser();
    if (!user) { navigate('/login'); return; }
    const all = getConductorComprobantes(user.id, filterMesComp || undefined);
    setComprobantes(all);
    const totalAprobado = all
      .filter(c => c.estado === 'aprobado')
      .reduce((s, c) => s + c.monto, 0);
    const pendientes = all.filter(c => c.estado === 'pendiente');
    const totalPendiente = pendientes.reduce((s, c) => s + c.monto, 0);
    setCompStats({
      totalAprobado,
      totalPendiente,
      cantidadPendientes: pendientes.length,
      totalAcumulado: all.filter(c => c.estado === 'aprobado').reduce((s, c) => s + c.monto, 0),
    });
  };

  useEffect(() => { loadTransactions(); }, [selectedMonth, navigate]);
  useEffect(() => { loadComprobantes(); }, [filterMesComp, navigate]);

  // ── Transaction handlers ─────────────────────────────────────────────────

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

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      deleteTransaction(id);
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

  // ── Comprobante handlers ─────────────────────────────────────────────────

  const openValidarModal = (comp: ComprobantePago, action: 'aprobado' | 'rechazado') => {
    setSelectedComp(comp);
    setValidarAction(action);
    setComentario('');
    setShowValidarModal(true);
  };

  const handleValidar = () => {
    if (!selectedComp || !validarAction) return;
    updateComprobanteEstado(selectedComp.id, validarAction, comentario);
    loadComprobantes();
    setShowValidarModal(false);
    setSelectedComp(null);
  };

  const openArchivoModal = (comp: ComprobantePago) => {
    setSelectedComp(comp);
    setShowArchivoModal(true);
  };

  // ── Static data ──────────────────────────────────────────────────────────

  const categorias: { value: TransactionCategory; label: string }[] = [
    { value: 'pago_estudiante', label: 'Pago de Estudiante' },
    { value: 'combustible', label: 'Combustible' },
    { value: 'peaje', label: 'Peaje' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'seguro', label: 'Seguro' },
    { value: 'parqueadero', label: 'Parqueadero' },
    { value: 'otro', label: 'Otro' },
  ];

  const getCategoryLabel = (cat: TransactionCategory) =>
    categorias.find(c => c.value === cat)?.label || cat;

  const filteredTransactions = transactions.filter(
    t => filterCategory === 'todas' || t.categoria === filterCategory
  );

  const filteredComprobantes = comprobantes.filter(
    c => filterEstado === 'todos' || c.estado === filterEstado
  );

  const chartData = [
    { name: 'Ingresos', Monto: stats.ingresos },
    { name: 'Gastos', Monto: stats.gastos },
  ];

  const tabClass = (tab: 'transacciones' | 'comprobantes') =>
    `relative px-5 py-3 text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'text-[#2A6DF4] border-b-2 border-[#2A6DF4]'
        : 'text-gray-500 hover:text-gray-700'
    }`;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Finanzas</h2>
          <p className="text-gray-600 mt-1">Control de ingresos, gastos y comprobantes de pago</p>
        </div>
        {activeTab === 'transacciones' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: '#2A6DF4' }}
          >
            <Plus className="w-5 h-5" />
            Nueva Transacción
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button className={tabClass('transacciones')} onClick={() => setActiveTab('transacciones')}>
          <DollarSign className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Transacciones
        </button>
        <button className={tabClass('comprobantes')} onClick={() => setActiveTab('comprobantes')}>
          <Receipt className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Comprobantes de pago
          {compStats.cantidadPendientes > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-yellow-500 text-white">
              {compStats.cantidadPendientes}
            </span>
          )}
        </button>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB 1: TRANSACCIONES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'transacciones' && (
        <>
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
                onChange={e => setSelectedMonth(e.target.value)}
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
                onChange={e => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">${stats.ingresos.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Ingresos del mes</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">${stats.gastos.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Gastos del mes</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className={`text-3xl font-bold mb-1 ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats.balance.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Balance neto</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Mes</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="Monto" fill="#2A6DF4" radius={[4, 4, 0, 0]} />
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
                {filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
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
                        <div className="font-medium text-gray-900">{transaction.concepto}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`text-xl font-bold ${
                            transaction.tipo === 'ingreso' ? 'text-[#34C759]' : 'text-[#FF3B30]'
                          }`}
                        >
                          {transaction.tipo === 'ingreso' ? '+' : '-'}${transaction.monto.toLocaleString()}
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
        </>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TAB 2: COMPROBANTES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'comprobantes' && (
        <>
          {/* ── Balance financiero ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${compStats.totalAprobado.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total recibido</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {compStats.cantidadPendientes}
              </div>
              <div className="text-sm text-gray-600">Pendientes por verificar</div>
              <div className="text-xs text-orange-600 mt-1">
                ${compStats.totalPendiente.toLocaleString()} en espera
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${compStats.totalAcumulado.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total acumulado</div>
              <div className="text-xs text-gray-400 mt-1">
                {filterMesComp ? mesPagoDisplay(filterMesComp) : 'Todos los periodos'}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{comprobantes.length}</div>
              <div className="text-sm text-gray-600">Comprobantes totales</div>
              <div className="text-xs text-gray-400 mt-1">
                {comprobantes.filter(c => c.estado === 'aprobado').length} aprobados
                {' - '}
                {comprobantes.filter(c => c.estado === 'rechazado').length} rechazados
              </div>
            </div>
          </div>

          {/* ── Filtros ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Período
              </label>
              <select
                value={filterMesComp}
                onChange={e => setFilterMesComp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los períodos</option>
                {Array.from(new Set(comprobantes.map(c => c.mesPago)))
                  .sort((a, b) => b.localeCompare(a))
                  .map(mes => (
                    <option key={mes} value={mes}>{mesPagoDisplay(mes)}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Estado
              </label>
              <select
                value={filterEstado}
                onChange={e => setFilterEstado(e.target.value as 'todos' | EstadoComprobante)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">No recibido</option>
              </select>
            </div>
          </div>

          {/* ── Lista de comprobantes ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Comprobantes ({filteredComprobantes.length})
              </h3>
              {compStats.cantidadPendientes > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  {compStats.cantidadPendientes} pendiente(s) por verificar
                </div>
              )}
            </div>

            {filteredComprobantes.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No hay comprobantes para este período o estado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredComprobantes.map(comp => (
                  <div
                    key={comp.id}
                    className={`p-5 hover:bg-gray-50 transition-colors ${
                      comp.estado === 'pendiente' ? 'border-l-4 border-l-amber-400' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <EstadoBadge estado={comp.estado} />
                          <span className="text-xs text-gray-400">
                            {mesPagoDisplay(comp.mesPago)}
                          </span>
                          {comp.referenciaFactura && (
                            <span className="text-xs text-gray-400">· {comp.referenciaFactura}</span>
                          )}
                        </div>

                        <div className="font-semibold text-gray-900 text-base">
                          {comp.estudianteNombre}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          Acudiente: {comp.acudienteNombre}
                        </div>

                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span className="font-semibold text-gray-800">
                              ${comp.monto.toLocaleString()}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(comp.fechaSubida).toLocaleDateString('es-ES', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </span>
                          {comp.archivoNombre && (
                            <span className="flex items-center gap-1 text-blue-600 truncate max-w-[200px]">
                              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{comp.archivoNombre}</span>
                            </span>
                          )}
                        </div>

                        {comp.comentarioValidacion && (
                          <div className="mt-2 flex items-start gap-1.5 text-sm text-gray-500 italic">
                            <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            {comp.comentarioValidacion}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                        {/* Ver comprobante */}
                        <button
                          onClick={() => openArchivoModal(comp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver comprobante
                        </button>

                        {/* Acciones de validación (solo si está pendiente) */}
                        {comp.estado === 'pendiente' && (
                          <>
                            <button
                              onClick={() => openValidarModal(comp, 'aprobado')}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-white bg-[#34C759] hover:bg-green-600 transition-colors font-medium"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Aprobar pago
                            </button>
                            <button
                              onClick={() => openValidarModal(comp, 'rechazado')}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-white bg-[#FF3B30] hover:bg-red-600 transition-colors font-medium"
                            >
                              <XCircle className="w-4 h-4" />
                              No recibido
                            </button>
                          </>
                        )}

                        {/* Re-evaluar si ya fue validado */}
                        {comp.estado !== 'pendiente' && (
                          <button
                            onClick={() => {
                              const action = comp.estado === 'aprobado' ? 'rechazado' : 'aprobado';
                              openValidarModal(comp, action);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            Cambiar estado
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MODALES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

      {/* Modal: Transacción nueva */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Nueva Transacción</h3>
              <button
                onClick={handleCloseForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select
                  required
                  value={formData.categoria}
                  onChange={e =>
                    setFormData({ ...formData, categoria: e.target.value as TransactionCategory })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Concepto *</label>
                <input
                  type="text"
                  required
                  value={formData.concepto}
                  onChange={e => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Tanque de gasolina"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monto *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.monto}
                  onChange={e => setFormData({ ...formData, monto: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
                <input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={e => setFormData({ ...formData, fecha: e.target.value })}
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

      {/* Modal: Ver archivo del comprobante */}
      {showArchivoModal && selectedComp && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Comprobante de pago</h3>
                <p className="text-sm text-gray-500">
                  {selectedComp.estudianteNombre} · {mesPagoDisplay(selectedComp.mesPago)}
                </p>
              </div>
              <button
                onClick={() => setShowArchivoModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metadata */}
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-2 gap-x-6 gap-y-1 text-sm flex-shrink-0">
              <div><span className="text-gray-500">Acudiente:</span> <span className="font-medium">{selectedComp.acudienteNombre}</span></div>
              <div><span className="text-gray-500">Estudiante:</span> <span className="font-medium">{selectedComp.estudianteNombre}</span></div>
              <div><span className="text-gray-500">Período:</span> <span className="font-medium">{mesPagoDisplay(selectedComp.mesPago)}</span></div>
              <div><span className="text-gray-500">Monto:</span> <span className="font-medium text-[#34C759]">${selectedComp.monto.toLocaleString()}</span></div>
              <div><span className="text-gray-500">Fecha envío:</span> <span className="font-medium">{new Date(selectedComp.fechaSubida).toLocaleDateString('es-ES')}</span></div>
              <div><span className="text-gray-500">Estado:</span> <EstadoBadge estado={selectedComp.estado} /></div>
            </div>

            {/* Archivo */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {selectedComp.archivoUrl ? (
                <img
                  src={selectedComp.archivoUrl}
                  alt="Comprobante de pago"
                  className="max-w-full max-h-[55vh] rounded-lg shadow object-contain bg-white"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-3" />
                  <p>Archivo no disponible en modo demo</p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
              <button
                onClick={() => setShowArchivoModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cerrar
              </button>
              {selectedComp.estado === 'pendiente' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowArchivoModal(false); openValidarModal(selectedComp, 'rechazado'); }}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white bg-[#FF3B30] hover:bg-red-600 transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    No recibido
                  </button>
                  <button
                    onClick={() => { setShowArchivoModal(false); openValidarModal(selectedComp, 'aprobado'); }}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white bg-[#34C759] hover:bg-green-600 transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprobar pago
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Validar comprobante */}
      {showValidarModal && selectedComp && validarAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {validarAction === 'aprobado' ? 'Aprobar pago' : 'Marcar como no recibido'}
              </h3>
              <button
                onClick={() => setShowValidarModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Summary */}
              <div
                className={`p-4 rounded-lg ${
                  validarAction === 'aprobado' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="text-sm font-medium text-gray-800 mb-1">
                  {selectedComp.estudianteNombre}
                </div>
                <div className="text-sm text-gray-600">
                  Acudiente: {selectedComp.acudienteNombre}
                </div>
                <div className="text-sm text-gray-600">
                  Período: {mesPagoDisplay(selectedComp.mesPago)}
                </div>
                <div
                  className={`text-base font-bold mt-1 ${
                    validarAction === 'aprobado' ? 'text-[#34C759]' : 'text-[#FF3B30]'
                  }`}
                >
                  ${selectedComp.monto.toLocaleString()}
                </div>
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Comentario{validarAction === 'rechazado' ? ' (recomendado)' : ' (opcional)'}
                </label>
                <textarea
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder={
                    validarAction === 'aprobado'
                      ? 'Ej: Pago recibido correctamente.'
                      : 'Ej: El valor del comprobante no coincide con la tarifa.'
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowValidarModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleValidar}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium text-sm transition-colors ${
                    validarAction === 'aprobado'
                      ? 'bg-[#34C759] hover:bg-green-600'
                      : 'bg-[#FF3B30] hover:bg-red-600'
                  }`}
                >
                  {validarAction === 'aprobado' ? (
                    <><CheckCircle className="w-4 h-4" /> Confirmar pago</>
                  ) : (
                    <><XCircle className="w-4 h-4" /> Marcar no recibido</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
