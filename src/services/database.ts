import { v4 as uuidv4 } from 'uuid'

export interface DatabaseQuery {
  sql: string
  params?: any[]
}

class DatabaseService {
  private static instance: DatabaseService
  private patients: Map<string, any> = new Map()
  private doctors: Map<string, any> = new Map()
  private appointments: Map<string, any> = new Map()
  private clinicalRecords: Map<string, any> = new Map()
  private users: Map<string, any> = new Map()
  private products: Map<string, any> = new Map()
  private invoices: Map<string, any> = new Map()
  private services: Map<string, any> = new Map()

  private constructor() {
    this.loadFromStorage()
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  private loadFromStorage() {
    try {
      const patientsData = localStorage.getItem('clinic_patients')
      if (patientsData) {
        const patients = JSON.parse(patientsData)
        this.patients = new Map(Object.entries(patients))
      }

      const doctorsData = localStorage.getItem('clinic_doctors')
      if (doctorsData) {
        const doctors = JSON.parse(doctorsData)
        this.doctors = new Map(Object.entries(doctors))
      }

      const appointmentsData = localStorage.getItem('clinic_appointments')
      if (appointmentsData) {
        const appointments = JSON.parse(appointmentsData)
        this.appointments = new Map(Object.entries(appointments))
      }

      const clinicalRecordsData = localStorage.getItem('clinic_clinical_records')
      if (clinicalRecordsData) {
        const records = JSON.parse(clinicalRecordsData)
        this.clinicalRecords = new Map(Object.entries(records))
      }

      const usersData = localStorage.getItem('clinic_users')
      if (usersData) {
        const users = JSON.parse(usersData)
        this.users = new Map(Object.entries(users))
      } else {
        // Default admin user
        const defaultUser = {
          id: 'user_1',
          name: 'Admin Usuario',
          email: 'admin@clinic.com',
          username: 'admin',
          password: 'password',
          role: 'admin',
          photo: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        this.users.set(defaultUser.id, defaultUser)
        this.saveToStorage()
      }

      const productsData = localStorage.getItem('clinic_products')
      if (productsData) {
        const products = JSON.parse(productsData)
        this.products = new Map(Object.entries(products))
      }

      const invoicesData = localStorage.getItem('clinic_invoices')
      if (invoicesData) {
        const invoices = JSON.parse(invoicesData)
        this.invoices = new Map(Object.entries(invoices))
      }

      const servicesData = localStorage.getItem('clinic_services')
      if (servicesData) {
        const services = JSON.parse(servicesData)
        this.services = new Map(Object.entries(services))
      }

      console.log('Datos cargados desde localStorage')
    } catch (error) {
      console.error('Error al cargar datos de localStorage:', error)
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('clinic_patients', JSON.stringify(Object.fromEntries(this.patients)))
      localStorage.setItem('clinic_doctors', JSON.stringify(Object.fromEntries(this.doctors)))
      localStorage.setItem('clinic_appointments', JSON.stringify(Object.fromEntries(this.appointments)))
      localStorage.setItem('clinic_clinical_records', JSON.stringify(Object.fromEntries(this.clinicalRecords)))
      localStorage.setItem('clinic_users', JSON.stringify(Object.fromEntries(this.users)))
      localStorage.setItem('clinic_products', JSON.stringify(Object.fromEntries(this.products)))
      localStorage.setItem('clinic_invoices', JSON.stringify(Object.fromEntries(this.invoices)))
      localStorage.setItem('clinic_services', JSON.stringify(Object.fromEntries(this.services)))
    } catch (error) {
      console.error('Error al guardar datos en localStorage:', error)
    }
  }

  async init() {
    console.log('Base de datos inicializada correctamente')
  }

  // PATIENTS
  createPatient(patient: any) {
    const id = patient.id || uuidv4()
    const newPatient = {
      ...patient,
      id,
      createdAt: patient.createdAt || new Date().toISOString(),
      updatedAt: patient.updatedAt || new Date().toISOString(),
    }
    this.patients.set(id, newPatient)
    this.saveToStorage()
    return newPatient
  }

  getPatient(id: string) {
    return this.patients.get(id) || null
  }

  getAllPatients() {
    const patients = Array.from(this.patients.values())
    return patients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  updatePatient(id: string, updates: any) {
    const patient = this.patients.get(id)
    if (patient) {
      const updated = {
        ...patient,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.patients.set(id, updated)
      this.saveToStorage()
      return updated
    }
    return null
  }

  deletePatient(id: string) {
    this.patients.delete(id)
    this.saveToStorage()
    return { success: true }
  }

  // DOCTORS
  createDoctor(doctor: any) {
    const id = doctor.id || uuidv4()
    const newDoctor = {
      ...doctor,
      id,
      createdAt: doctor.createdAt || new Date().toISOString(),
      updatedAt: doctor.updatedAt || new Date().toISOString(),
    }
    this.doctors.set(id, newDoctor)
    this.saveToStorage()
    return newDoctor
  }

  getDoctor(id: string) {
    return this.doctors.get(id) || null
  }

  getAllDoctors() {
    return Array.from(this.doctors.values())
  }

  updateDoctor(id: string, updates: any) {
    const doctor = this.doctors.get(id)
    if (doctor) {
      const updated = {
        ...doctor,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.doctors.set(id, updated)
      this.saveToStorage()
      return updated
    }
    return null
  }

  deleteDoctor(id: string) {
    this.doctors.delete(id)
    this.saveToStorage()
    return { success: true }
  }

  // APPOINTMENTS
  createAppointment(appointment: any) {
    const id = appointment.id || uuidv4()
    const newAppointment = {
      ...appointment,
      id,
      createdAt: appointment.createdAt || new Date().toISOString(),
      updatedAt: appointment.updatedAt || new Date().toISOString(),
    }
    this.appointments.set(id, newAppointment)
    this.saveToStorage()
    return newAppointment
  }

  getAppointment(id: string) {
    return this.appointments.get(id) || null
  }

  getAllAppointments() {
    return Array.from(this.appointments.values())
  }

  getAppointmentsByDate(date: string) {
    return Array.from(this.appointments.values()).filter(a => a.date === date)
  }

  getAppointmentsByDoctor(doctorId: string) {
    return Array.from(this.appointments.values()).filter(a => a.doctorId === doctorId)
  }

  updateAppointment(id: string, updates: any) {
    const appointment = this.appointments.get(id)
    if (appointment) {
      const updated = {
        ...appointment,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.appointments.set(id, updated)
      this.saveToStorage()
      return updated
    }
    return null
  }

  deleteAppointment(id: string) {
    this.appointments.delete(id)
    this.saveToStorage()
    return { success: true }
  }

  // CLINICAL RECORDS
  createClinicalRecord(record: any) {
    const id = record.id || uuidv4()
    const newRecord = {
      ...record,
      id,
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: record.updatedAt || new Date().toISOString(),
    }
    this.clinicalRecords.set(id, newRecord)
    this.saveToStorage()
    return newRecord
  }

  getClinicalRecord(id: string) {
    return this.clinicalRecords.get(id) || null
  }

  getAllClinicalRecords() {
    return Array.from(this.clinicalRecords.values())
  }

  getClinicalRecordsByPatient(patientId: string) {
    return Array.from(this.clinicalRecords.values()).filter(r => r.patientId === patientId)
  }

  updateClinicalRecord(id: string, updates: any) {
    const record = this.clinicalRecords.get(id)
    if (record) {
      const updated = {
        ...record,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.clinicalRecords.set(id, updated)
      this.saveToStorage()
      return updated
    }
    return null
  }

  deleteClinicalRecord(id: string) {
    this.clinicalRecords.delete(id)
    this.saveToStorage()
    return { success: true }
  }

  // USERS
  createUser(user: any) {
    const id = user.id || `user_${Date.now()}`
    const newUser = {
      ...user,
      id,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    }
    this.users.set(id, newUser)
    this.saveToStorage()
    return newUser
  }

  getUser(id: string) {
    return this.users.get(id) || null
  }

  getUserByEmail(email: string) {
    return Array.from(this.users.values()).find(u => u.email === email) || null
  }

  getAllUsers() {
    return Array.from(this.users.values())
  }

  updateUser(id: string, updates: any) {
    const user = this.users.get(id)
    if (user) {
      const updated = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.users.set(id, updated)
      this.saveToStorage()
      return updated
    }
    return null
  }

  deleteUser(id: string) {
    this.users.delete(id)
    this.saveToStorage()
    return { success: true }
  }

  // PRODUCTS
  createProduct(product: any) {
    const id = product.id || uuidv4()
    const newProduct = {
      ...product,
      id,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    }
    this.products.set(id, newProduct)
    this.saveToStorage()
    return newProduct
  }

  getProduct(id: string) {
    return this.products.get(id) || null
  }

  getAllProducts() {
    return Array.from(this.products.values())
  }

  updateProduct(id: string, updates: any) {
    const product = this.products.get(id)
    if (product) {
      const updated = {
        ...product,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.products.set(id, updated)
      this.saveToStorage()
      return updated
    }
    return null
  }

  deleteProduct(id: string) {
    this.products.delete(id)
    this.saveToStorage()
    return { success: true }
  }

  // INVOICES
  createInvoice(invoice: any) {
    const id = invoice.id || uuidv4()
    const newInvoice = {
      ...invoice,
      id,
      createdAt: invoice.createdAt || new Date().toISOString(),
      updatedAt: invoice.updatedAt || new Date().toISOString(),
    }
    this.invoices.set(id, newInvoice)
    this.saveToStorage()
    return newInvoice
  }

  getInvoice(id: string) {
    return this.invoices.get(id) || null
  }

  getAllInvoices() {
    return Array.from(this.invoices.values())
  }

  updateInvoice(id: string, updates: any) {
    const invoice = this.invoices.get(id)
    if (invoice) {
      const updated = {
        ...invoice,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.invoices.set(id, updated)
      this.saveToStorage()
      return updated
    }
    return null
  }

  deleteInvoice(id: string) {
    this.invoices.delete(id)
    this.saveToStorage()
    return { success: true }
  }

  // SERVICES
  createService(service: any) {
    const id = service.id || uuidv4()
    const newService = {
      ...service,
      id,
      createdAt: service.createdAt || new Date().toISOString(),
      updatedAt: service.updatedAt || new Date().toISOString(),
    }
    this.services.set(id, newService)
    this.saveToStorage()
    return newService
  }

  getService(id: string) {
    return this.services.get(id) || null
  }

  getAllServices() {
    return Array.from(this.services.values())
  }

  updateService(id: string, updates: any) {
    const service = this.services.get(id)
    if (service) {
      const updated = {
        ...service,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.services.set(id, updated)
      this.saveToStorage()
      return updated
    }
    return null
  }

  deleteService(id: string) {
    this.services.delete(id)
    this.saveToStorage()
    return { success: true }
  }

  // Dental Conditions
  private dentalConditions = new Map()

  getDentalConditions() {
    return Array.from(this.dentalConditions.values())
  }

  addDentalCondition(condition: any) {
    this.dentalConditions.set(condition.id, condition)
    return condition
  }

  updateDentalCondition(id: string, condition: any) {
    if (this.dentalConditions.has(id)) {
      this.dentalConditions.set(id, { ...condition, id })
      return condition
    }
    return null
  }

  deleteDentalCondition(id: string) {
    this.dentalConditions.delete(id)
    return { success: true }
  }

  // Dental Evaluations
  private dentalEvaluations = new Map()

  saveDentalEvaluation(evaluation: any) {
    this.dentalEvaluations.set(evaluation.id, evaluation)
    return evaluation
  }

  getDentalEvaluation(id: string) {
    return this.dentalEvaluations.get(id)
  }

  getPatientEvaluations(patientId: string) {
    return Array.from(this.dentalEvaluations.values()).filter(
      (e: any) => e.patientId === patientId
    )
  }

  getAllDentalEvaluations() {
    return Array.from(this.dentalEvaluations.values())
  }

  updateDentalEvaluation(id: string, evaluation: any) {
    if (this.dentalEvaluations.has(id)) {
      this.dentalEvaluations.set(id, { ...evaluation, id })
      return evaluation
    }
    return null
  }

  deleteDentalEvaluation(id: string) {
    this.dentalEvaluations.delete(id)
    return { success: true }
  }

  close() {
    console.log('Base de datos cerrada')
  }
}

export default DatabaseService.getInstance()
