// Utilidades para gestión de datos en localStorage - Ampliado

import {
  User,
  Vehicle,
  Student,
  AttendanceConfirmation,
  BoardingRecord,
  Maintenance,
  VehicleDocument,
  Transaction,
  Invoice,
  Notification,
} from './types';

const STORAGE_KEYS = {
  CURRENT_USER: 'rutasmart_current_user',
  USERS: 'rutasmart_users',
  VEHICLES: 'rutasmart_vehicles',
  STUDENTS: 'rutasmart_students',
  ATTENDANCE: 'rutasmart_attendance',
  BOARDING: 'rutasmart_boarding',
  MAINTENANCE: 'rutasmart_maintenance',
  DOCUMENTS: 'rutasmart_documents',
  TRANSACTIONS: 'rutasmart_transactions',
  INVOICES: 'rutasmart_invoices',
  NOTIFICATIONS: 'rutasmart_notifications',
};

// Usuario actual
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Usuarios
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  return getUsers().find(u => u.email === email);
};

// Vehículos
export const getVehicles = (): Vehicle[] => {
  const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
  return data ? JSON.parse(data) : [];
};

export const getUserVehicle = (userId: string): Vehicle | undefined => {
  return getVehicles().find(v => v.userId === userId);
};

export const saveVehicle = (vehicle: Vehicle) => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === vehicle.id);
  if (index >= 0) {
    vehicles[index] = vehicle;
  } else {
    vehicles.push(vehicle);
  }
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
};

// Estudiantes
export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return data ? JSON.parse(data) : [];
};

export const getUserStudents = (userId: string): Student[] => {
  return getStudents().filter(s => s.userId === userId && s.activo);
};

export const getStudentsByAcudiente = (acudienteId: string): Student[] => {
  return getStudents().filter(s => s.acudienteId === acudienteId && s.activo);
};

export const saveStudent = (student: Student) => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === student.id);
  if (index >= 0) {
    students[index] = student;
  } else {
    students.push(student);
  }
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const deleteStudent = (studentId: string) => {
  const students = getStudents();
  const student = students.find(s => s.id === studentId);
  if (student) {
    student.activo = false;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }
};

// Asistencia
export const getAttendance = (): AttendanceConfirmation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return data ? JSON.parse(data) : [];
};

export const getTodayAttendance = (userId: string): AttendanceConfirmation[] => {
  const today = new Date().toISOString().split('T')[0];
  const students = getUserStudents(userId);
  const studentIds = students.map(s => s.id);
  
  return getAttendance().filter(
    a => a.fecha === today && studentIds.includes(a.studentId)
  );
};

export const saveAttendance = (attendance: AttendanceConfirmation) => {
  const allAttendance = getAttendance();
  const index = allAttendance.findIndex(
    a => a.studentId === attendance.studentId && a.fecha === attendance.fecha
  );
  
  if (index >= 0) {
    allAttendance[index] = attendance;
  } else {
    allAttendance.push(attendance);
  }
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(allAttendance));
};

export const getStudentAttendanceToday = (studentId: string): AttendanceConfirmation | undefined => {
  const today = new Date().toISOString().split('T')[0];
  return getAttendance().find(
    a => a.studentId === studentId && a.fecha === today
  );
};

// Abordaje
export const getBoardingRecords = (): BoardingRecord[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BOARDING);
  return data ? JSON.parse(data) : [];
};

export const getTodayBoarding = (studentIds: string[]): BoardingRecord[] => {
  const today = new Date().toISOString().split('T')[0];
  return getBoardingRecords().filter(
    b => b.fecha === today && studentIds.includes(b.studentId)
  );
};

export const saveBoardingRecord = (record: BoardingRecord) => {
  const records = getBoardingRecords();
  const index = records.findIndex(
    r => r.studentId === record.studentId && r.fecha === record.fecha && r.tipo === record.tipo
  );
  
  if (index >= 0) {
    records[index] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem(STORAGE_KEYS.BOARDING, JSON.stringify(records));
};

// Mantenimiento
export const getMaintenanceRecords = (): Maintenance[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
  return data ? JSON.parse(data) : [];
};

export const getVehicleMaintenance = (vehicleId: string): Maintenance[] => {
  return getMaintenanceRecords()
    .filter(m => m.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};

export const saveMaintenance = (maintenance: Maintenance) => {
  const records = getMaintenanceRecords();
  const index = records.findIndex(m => m.id === maintenance.id);
  
  if (index >= 0) {
    records[index] = maintenance;
  } else {
    records.push(maintenance);
  }
  localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(records));
};

// Documentos del vehículo
export const getVehicleDocuments = (): VehicleDocument[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
  return data ? JSON.parse(data) : [];
};

export const getDocumentsByVehicle = (vehicleId: string): VehicleDocument[] => {
  return getVehicleDocuments().filter(d => d.vehicleId === vehicleId);
};

export const saveVehicleDocument = (document: VehicleDocument) => {
  const documents = getVehicleDocuments();
  const index = documents.findIndex(d => d.id === document.id);
  
  if (index >= 0) {
    documents[index] = document;
  } else {
    documents.push(document);
  }
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
};

// Transacciones
export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const getUserTransactions = (userId: string, month?: string): Transaction[] => {
  let transactions = getTransactions().filter(t => t.userId === userId);
  
  if (month) {
    transactions = transactions.filter(t => t.fecha.startsWith(month));
  }
  
  return transactions.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};

export const saveTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === transaction.id);
  
  if (index >= 0) {
    transactions[index] = transaction;
  } else {
    transactions.push(transaction);
  }
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const deleteTransaction = (transactionId: string) => {
  const transactions = getTransactions().filter(t => t.id !== transactionId);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// Facturas
export const getInvoices = (): Invoice[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
  return data ? JSON.parse(data) : [];
};

export const getInvoicesByStudent = (studentId: string): Invoice[] => {
  return getInvoices()
    .filter(i => i.studentId === studentId)
    .sort((a, b) => b.mes.localeCompare(a.mes));
};

export const getInvoicesByConductor = (conductorId: string): Invoice[] => {
  return getInvoices()
    .filter(i => i.conductorId === conductorId)
    .sort((a, b) => b.mes.localeCompare(a.mes));
};

export const saveInvoice = (invoice: Invoice) => {
  const invoices = getInvoices();
  const index = invoices.findIndex(i => i.id === invoice.id);
  
  if (index >= 0) {
    invoices[index] = invoice;
  } else {
    invoices.push(invoice);
  }
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

// Notificaciones
export const getNotifications = (): Notification[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return data ? JSON.parse(data) : [];
};

export const getUserNotifications = (userId: string): Notification[] => {
  return getNotifications()
    .filter(n => n.userId === userId)
    .sort((a, b) => {
      const dateA = new Date(`${a.fecha} ${a.hora}`);
      const dateB = new Date(`${b.fecha} ${b.hora}`);
      return dateB.getTime() - dateA.getTime();
    });
};

export const getUnreadNotifications = (userId: string): Notification[] => {
  return getUserNotifications(userId).filter(n => !n.leida);
};

export const saveNotification = (notification: Notification) => {
  const notifications = getNotifications();
  notifications.push(notification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const markNotificationAsRead = (notificationId: string) => {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.leida = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

export const markAllNotificationsAsRead = (userId: string) => {
  const notifications = getNotifications();
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.leida = true;
    }
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};
