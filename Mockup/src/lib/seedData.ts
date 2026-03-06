// Datos de demostración para RutaSmart

import {
  saveUser,
  saveVehicle,
  saveStudent,
  saveAttendance,
  saveBoardingRecord,
  saveMaintenance,
  saveVehicleDocument,
  saveTransaction,
  saveInvoice,
  saveNotification,
} from './storage';

export const seedDemoData = () => {
  // Check if data already exists
  if (localStorage.getItem('rutasmart_demo_seeded') === 'true') {
    return;
  }

  const conductorId = 'demo-conductor-1';
  const acudienteId = 'demo-acudiente-1';
  const vehicleId = 'demo-vehicle-1';
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7);

  // Create demo conductor
  saveUser({
    id: conductorId,
    nombre: 'Carlos Rodríguez',
    telefono: '3001234567',
    email: 'conductor@demo.com',
    password: 'demo123',
    tipo: 'conductor',
    createdAt: '2025-01-01T00:00:00.000Z',
  });

  // Create demo acudiente
  saveUser({
    id: acudienteId,
    nombre: 'María González',
    telefono: '3009876543',
    email: 'padre@demo.com',
    password: 'demo123',
    tipo: 'acudiente',
    createdAt: '2025-01-15T00:00:00.000Z',
  });

  // Create vehicle
  saveVehicle({
    id: vehicleId,
    userId: conductorId,
    placa: 'ABC123',
    modelo: 'Toyota Hiace 2018',
    capacidad: 15,
    createdAt: '2025-01-01T00:00:00.000Z',
  });

  // Create students
  const students = [
    {
      id: 'student-1',
      userId: conductorId,
      acudienteId: acudienteId,
      nombre: 'Sofía González',
      direccion: 'Calle 45 #23-12, Apartamento 301',
      lat: 4.6097,
      lng: -74.0817,
      telefonoAcudiente: '3009876543',
      nombreAcudiente: 'María González',
      grado: '5to grado',
      colegio: 'Colegio San José',
      activo: true,
      createdAt: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'student-2',
      userId: conductorId,
      nombre: 'Juan Martínez',
      direccion: 'Carrera 15 #78-45',
      lat: 4.6297,
      lng: -74.0917,
      telefonoAcudiente: '3001112233',
      nombreAcudiente: 'Pedro Martínez',
      grado: '7mo grado',
      colegio: 'Colegio San José',
      activo: true,
      createdAt: '2025-01-20T00:00:00.000Z',
    },
    {
      id: 'student-3',
      userId: conductorId,
      nombre: 'Ana Torres',
      direccion: 'Avenida 19 #120-50',
      lat: 4.6197,
      lng: -74.0717,
      telefonoAcudiente: '3004445566',
      nombreAcudiente: 'Laura Torres',
      grado: '6to grado',
      colegio: 'Colegio San José',
      activo: true,
      createdAt: '2025-01-22T00:00:00.000Z',
    },
  ];

  students.forEach((student) => saveStudent(student));

  // Create attendance for today
  saveAttendance({
    id: 'att-1',
    studentId: 'student-1',
    fecha: today,
    confirmado: true,
    horaConfirmacion: '07:30',
  });

  saveAttendance({
    id: 'att-2',
    studentId: 'student-2',
    fecha: today,
    confirmado: true,
    horaConfirmacion: '07:45',
  });

  // Create boarding records
  saveBoardingRecord({
    id: 'board-1',
    studentId: 'student-1',
    fecha: today,
    tipo: 'ida',
    status: 'descendio',
    horaAbordaje: '07:50',
    horaDescenso: '08:15',
  });

  saveBoardingRecord({
    id: 'board-2',
    studentId: 'student-2',
    fecha: today,
    tipo: 'ida',
    status: 'abordo',
    horaAbordaje: '07:55',
  });

  // Create maintenance records
  saveMaintenance({
    id: 'maint-1',
    vehicleId: vehicleId,
    tipo: 'aceite',
    descripcion: 'Cambio de aceite Mobil 5W-30',
    fecha: '2025-01-10',
    kilometraje: 145000,
    costo: 120000,
    taller: 'Taller Central',
  });

  saveMaintenance({
    id: 'maint-2',
    vehicleId: vehicleId,
    tipo: 'revision',
    descripcion: 'Revisión general de frenos',
    fecha: '2025-01-05',
    kilometraje: 144500,
    costo: 250000,
    taller: 'Frenos Express',
  });

  // Create vehicle documents
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  saveVehicleDocument({
    id: 'doc-1',
    vehicleId: vehicleId,
    tipo: 'soat',
    fechaVencimiento: sixMonthsFromNow.toISOString().split('T')[0],
    descripcion: 'SOAT 2025',
  });

  saveVehicleDocument({
    id: 'doc-2',
    vehicleId: vehicleId,
    tipo: 'tecnomecanica',
    fechaVencimiento: threeMonthsFromNow.toISOString().split('T')[0],
    descripcion: 'Revisión tecnomecánica',
  });

  // Create transactions
  const transactions = [
    {
      id: 'trans-1',
      userId: conductorId,
      tipo: 'ingreso' as const,
      categoria: 'pago_estudiante' as const,
      concepto: 'Pago mensual Sofía González',
      monto: 200000,
      fecha: '2025-02-01',
      studentId: 'student-1',
    },
    {
      id: 'trans-2',
      userId: conductorId,
      tipo: 'gasto' as const,
      categoria: 'combustible' as const,
      concepto: 'Tanque de gasolina',
      monto: 80000,
      fecha: '2025-02-05',
    },
    {
      id: 'trans-3',
      userId: conductorId,
      tipo: 'gasto' as const,
      categoria: 'peaje' as const,
      concepto: 'Peaje autopista',
      monto: 12000,
      fecha: '2025-02-08',
    },
    {
      id: 'trans-4',
      userId: conductorId,
      tipo: 'ingreso' as const,
      categoria: 'pago_estudiante' as const,
      concepto: 'Pago mensual Juan Martínez',
      monto: 200000,
      fecha: '2025-02-03',
      studentId: 'student-2',
    },
  ];

  transactions.forEach((trans) => saveTransaction(trans));

  // Create invoices
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().slice(0, 7);

  saveInvoice({
    id: 'inv-1',
    studentId: 'student-1',
    conductorId: conductorId,
    mes: currentMonth,
    monto: 200000,
    fechaEmision: '2025-02-01',
    fechaVencimiento: '2025-02-10',
    estado: 'pendiente',
  });

  saveInvoice({
    id: 'inv-2',
    studentId: 'student-1',
    conductorId: conductorId,
    mes: lastMonthStr,
    monto: 200000,
    fechaEmision: '2025-01-01',
    fechaVencimiento: '2025-01-10',
    estado: 'pagado',
    fechaPago: '2025-01-08',
    metodoPago: 'Transferencia',
  });

  // Create notifications
  saveNotification({
    id: 'notif-1',
    userId: conductorId,
    tipo: 'mantenimiento',
    titulo: 'Próximo mantenimiento',
    descripcion: 'El cambio de aceite está programado en 500 km',
    fecha: today,
    hora: '09:00',
    leida: false,
  });

  saveNotification({
    id: 'notif-2',
    userId: acudienteId,
    tipo: 'abordaje',
    titulo: 'Sofía abordó el transporte',
    descripcion: 'Tu hija acaba de abordar el transporte escolar',
    fecha: today,
    hora: '07:50',
    leida: false,
    studentId: 'student-1',
  });

  saveNotification({
    id: 'notif-3',
    userId: acudienteId,
    tipo: 'pago',
    titulo: 'Factura disponible',
    descripcion: 'La factura del mes de febrero está lista para pagar',
    fecha: '2025-02-01',
    hora: '08:00',
    leida: true,
  });

  // Mark as seeded
  localStorage.setItem('rutasmart_demo_seeded', 'true');
};
