// User & Authentication
export type UserRole = 'admin' | 'doctor' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  photo?: string | null;
  specialization?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Patient
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  city: string;
  gender?: string;
  notes?: string;
  photo?: string | null;
  allergies?: string[];
  medicalConditions?: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledDate: Date;
  duration: number; // minutes
  treatmentType: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Clinical Record
export interface ClinicalRecord {
  id: string;
  patientId: string;
  doctorId?: string;
  date?: Date;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  treatments?: TreatmentEntry[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TreatmentEntry {
  id: string;
  type: string;
  date: Date;
  doctor: string;
  notes?: string;
}

// Service/Treatment
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category: string;
  createdAt: Date;
}

// Invoice
export interface Invoice {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  issueDate: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  items: InvoiceItem[];
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Inventory
export interface InventoryProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  supplier?: string;
  expirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  createdAt: Date;
}

// Doctor Earnings
export interface DoctorEarnings {
  doctorId: string;
  period: string; // YYYY-MM
  totalRevenue: number;
  earningsPercentage: number;
  earnedAmount: number;
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalRevenueToday: number;
  totalRevenueMonth: number;
  appointmentsToday: number;
  appointmentsCompleted: number;
  newPatientsMonth: number;
  topProduct?: string;
}
