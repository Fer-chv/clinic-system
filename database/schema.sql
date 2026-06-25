-- Users/Staff table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'receptionist')),
  specialization TEXT,
  phone TEXT,
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  age INTEGER NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  allergies TEXT,
  medicalConditions TEXT,
  emergencyContact TEXT,
  emergencyPhone TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(firstName, lastName);

-- Services/Treatments table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price REAL NOT NULL,
  duration INTEGER NOT NULL,
  category TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  doctorId TEXT NOT NULL,
  scheduledDate DATETIME NOT NULL,
  duration INTEGER NOT NULL,
  treatmentType TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id),
  FOREIGN KEY (doctorId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduledDate);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctorId);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patientId);

-- Clinical Records table
CREATE TABLE IF NOT EXISTS clinical_records (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  doctorId TEXT NOT NULL,
  date DATETIME NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  notes TEXT,
  attachments TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id),
  FOREIGN KEY (doctorId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_clinical_records_patient ON clinical_records(patientId);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  doctorId TEXT NOT NULL,
  appointmentId TEXT,
  issueDate DATETIME NOT NULL,
  dueDate DATETIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  subtotal REAL NOT NULL,
  discount REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  total REAL NOT NULL,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id),
  FOREIGN KEY (doctorId) REFERENCES users(id),
  FOREIGN KEY (appointmentId) REFERENCES appointments(id)
);

CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(issueDate);
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patientId);
CREATE INDEX IF NOT EXISTS idx_invoices_doctor ON invoices(doctorId);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Invoice Items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id TEXT PRIMARY KEY,
  invoiceId TEXT NOT NULL,
  serviceId TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unitPrice REAL NOT NULL,
  total REAL NOT NULL,
  FOREIGN KEY (invoiceId) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (serviceId) REFERENCES services(id)
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoiceId);

-- Inventory Products table
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  minStock INTEGER NOT NULL,
  unitPrice REAL NOT NULL,
  supplier TEXT,
  expirationDate DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);

-- Inventory Movements table
CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES inventory(id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON inventory_movements(productId);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_date ON inventory_movements(createdAt);

-- Doctor Earnings table
CREATE TABLE IF NOT EXISTS doctor_earnings (
  id TEXT PRIMARY KEY,
  doctorId TEXT NOT NULL,
  period TEXT NOT NULL,
  totalRevenue REAL NOT NULL,
  earningsPercentage REAL NOT NULL,
  earnedAmount REAL NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctorId, period),
  FOREIGN KEY (doctorId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_doctor_earnings_period ON doctor_earnings(period);

-- Sync Queue table (for cloud synchronization)
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('insert', 'update', 'delete')),
  record_id TEXT NOT NULL,
  data TEXT,
  synced BOOLEAN DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  syncedAt DATETIME
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced);
