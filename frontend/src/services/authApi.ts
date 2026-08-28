export type AuthUser = {
  id?: number
  username: string
  email?: string
}

type AuthResponse = {
  token: string
  user?: AuthUser
}

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8765/api'

const AUTH_URL = `${API_URL}/auth`
const TOKEN_KEY = 'placement_tracker_token'
const USER_KEY = 'placement_tracker_user'

async function getErrorMessage(response: Response) {
  const data = await response.json()

  if (data.detail) {
    return data.detail
  }

  const firstError = Object.values(data)[0]

  if (Array.isArray(firstError)) {
    return String(firstError[0])
  }

  return 'Authentication failed.'
}

function saveAuthentication(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(USER_KEY)

  return storedUser ? JSON.parse(storedUser) : null
}

export function clearAuthentication() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const response = await fetch(`${AUTH_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data: AuthResponse = await response.json()
  const user = data.user ?? { username, email }

  saveAuthentication(data.token, user)

  return user
}

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  const response = await fetch(`${AUTH_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data: AuthResponse = await response.json()
  const user = { username }

  saveAuthentication(data.token, user)

  return user
}