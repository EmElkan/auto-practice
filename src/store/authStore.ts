import { create } from 'zustand'

type User = {
  username: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

// Mock credentials for testing
const VALID_CREDENTIALS = {
  username: 'testuser',
  password: 'password123',
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      set({ user: { username }, isAuthenticated: true })
      return { success: true }
    }

    return { success: false, error: 'Invalid username or password' }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
}))
