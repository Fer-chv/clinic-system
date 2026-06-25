import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { User, UserRole } from '@/types'

// Simular localStorage para desarrollo
const mockStorage = new Map<string, string>()

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null
  private currentToken: string | null = null

  private constructor() {
    this.restoreSession()
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private restoreSession() {
    const storedToken = mockStorage.get('authToken')
    const storedUser = mockStorage.get('currentUser')

    if (storedToken && storedUser) {
      this.currentToken = storedToken
      this.currentUser = JSON.parse(storedUser)
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      // Mock login - en producción, consultar BD
      const mockUsers: User[] = [
        {
          id: 'admin-1',
          name: 'Administrador',
          email: 'admin@clinic.com',
          username: 'admin',
          password: 'password',
          role: 'admin' as UserRole,
          specialization: undefined,
          phone: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'doctor-1',
          name: 'Dr. García',
          email: 'garcia@clinic.com',
          username: 'dgarcia',
          password: 'password',
          role: 'doctor' as UserRole,
          specialization: 'Ortodoncia',
          phone: '555-1234',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      const user = mockUsers.find(u => u.email === credentials.email)

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado',
        }
      }

      // Mock password verification
      const passwordMatch = credentials.password === 'password' // Demo only

      if (!passwordMatch) {
        return {
          success: false,
          error: 'Contraseña incorrecta',
        }
      }

      const token = uuidv4()
      this.currentUser = user
      this.currentToken = token

      mockStorage.set('authToken', token)
      mockStorage.set('currentUser', JSON.stringify(user))

      return {
        success: true,
        user,
        token,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error en login',
      }
    }
  }

  async register(data: {
    name: string
    email: string
    password: string
    role: UserRole
    specialization?: string
    phone?: string
  }): Promise<AuthResponse> {
    try {
      // Mock register - en producción, guardar en BD
      const hashedPassword = await bcrypt.hash(data.password, 10)

      const newUser: User = {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        username: data.name.toLowerCase().replace(/\s+/g, ''),
        password: hashedPassword,
        role: data.role,
        specialization: data.specialization,
        phone: data.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const token = uuidv4()
      this.currentUser = newUser
      this.currentToken = token

      mockStorage.set('authToken', token)
      mockStorage.set('currentUser', JSON.stringify(newUser))

      return {
        success: true,
        user: newUser,
        token,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error en registro',
      }
    }
  }

  logout(): void {
    this.currentUser = null
    this.currentToken = null
    mockStorage.delete('authToken')
    mockStorage.delete('currentUser')
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  getCurrentToken(): string | null {
    return this.currentToken
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentToken !== null
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role
  }

  hasAnyRole(...roles: UserRole[]): boolean {
    if (!this.currentUser) return false
    return roles.includes(this.currentUser.role)
  }
}

export default AuthService.getInstance()
