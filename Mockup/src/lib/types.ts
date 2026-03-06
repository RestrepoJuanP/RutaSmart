// Tipos de datos para RutaSmart

export interface User {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  password: string;
  tipo: 'conductor' | 'acudiente';
  foto?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  placa: string;
  modelo: string;
  capacidad: number;
  createdAt: string;
}

export interface Student {
  id: string;
  userId: string; // ID del conductor
  acudienteId?: string; // ID del acudiente/padre
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  telefonoAcudiente: string;
  nombreAcudiente: string;
  grado?: string;
  colegio?: string;
  foto?: string;
  activo: boolean;
  createdAt: string;
}

export interface AttendanceConfirmation {
  id: string;
  studentId: string;
  fecha: string; // YYYY-MM-DD
  confirmado: boolean;
  horaConfirmacion?: string;
}

export interface RouteStop {
  student: Student;
  order: number;
  distance: number;
  eta: string;
}

// Nuevos tipos para funcionalidades ampliadas

export type BoardingStatus = 'pendiente' | 'abordo' | 'descendio' | 'ausente';

export interface BoardingRecord {
  id: string;
  studentId: string;
  fecha: string; // YYYY-MM-DD
  tipo: 'ida' | 'regreso'; // mañana o tarde
  status: BoardingStatus;
  horaAbordaje?: string;
  horaDescenso?: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  tipo: 'aceite' | 'revision' | 'llantas' | 'frenos' | 'otro';
  descripcion: string;
  fecha: string;
  kilometraje: number;
  costo: number;
  taller?: string;
  proximoMantenimiento?: string;
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  tipo: 'soat' | 'tecnomecanica' | 'seguro' | 'otro';
  fechaVencimiento: string;
  descripcion?: string;
}

export type TransactionType = 'ingreso' | 'gasto';
export type TransactionCategory = 
  | 'pago_estudiante'
  | 'combustible'
  | 'peaje'
  | 'mantenimiento'
  | 'seguro'
  | 'parqueadero'
  | 'otro';

export interface Transaction {
  id: string;
  userId: string;
  tipo: TransactionType;
  categoria: TransactionCategory;
  concepto: string;
  monto: number;
  fecha: string;
  studentId?: string; // Para pagos de estudiantes
}

export interface Invoice {
  id: string;
  studentId: string;
  conductorId: string;
  mes: string; // YYYY-MM
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  fechaPago?: string;
  metodoPago?: string;
}

export type NotificationType = 
  | 'mantenimiento'
  | 'pago'
  | 'ruta'
  | 'retraso'
  | 'info'
  | 'abordaje';

export interface Notification {
  id: string;
  userId: string;
  tipo: NotificationType;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  leida: boolean;
  studentId?: string;
}

export type TripStatus = 'pendiente' | 'en_ruta' | 'abordo' | 'completado' | 'no_asiste';

export interface TripEvent {
  id: string;
  studentId: string;
  tipo: 'abordo' | 'descenso' | 'llegada';
  hora: string;
  descripcion: string;
}
