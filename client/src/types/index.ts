export interface User {
  id: string
  email: string
  emailConfirmed: boolean
  createdAt?: string
}

export interface Contact {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company?: string
  contact_category_id?: string
  created_at: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}
