import { useState, type FormEvent } from 'react'
import {
  login,
  register,
  type AuthUser,
} from '../services/authApi'

type AuthFormProps = {
  onAuthenticated: (user: AuthUser) => void
}

function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username'))
    const password = String(formData.get('password'))
    const email = String(formData.get('email') ?? '')

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const user = isRegistering
        ? await register(username, email, password)
        : await login(username, password)

      onAuthenticated(user)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Authentication failed.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function switchMode() {
    setIsRegistering((currentValue) => !currentValue)
    setErrorMessage('')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">PLACEMENT SEARCH</p>
        <h1>
          {isRegistering ? 'Create your account' : 'Welcome back'}
        </h1>
        <p>
          {isRegistering
            ? 'Start tracking your placement applications.'
            : 'Log in to access your application tracker.'}
        </p>

        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
            />
          </label>

          {isRegistering && (
            <label>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete={
                isRegistering ? 'new-password' : 'current-password'
              }
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait...'
              : isRegistering
                ? 'Create account'
                : 'Log in'}
          </button>
        </form>

        <button
          type="button"
          className="switch-auth-button"
          onClick={switchMode}
        >
          {isRegistering
            ? 'Already have an account? Log in'
            : 'Need an account? Register'}
        </button>
      </section>
    </main>
  )
}

export default AuthForm