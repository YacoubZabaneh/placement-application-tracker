import { useEffect, useState } from 'react'
import ApplicationFilters from './components/ApplicationFilters'
import ApplicationForm from './components/ApplicationForm'
import ApplicationTable from './components/ApplicationTable'
import AuthForm from './components/AuthForm'
import {
  clearAuthentication,
  getStoredUser,
  type AuthUser,
} from './services/authApi'
import {
  createApplication,
  deleteApplication as deleteApplicationRequest,
  getApplications,
  updateApplication,
} from './services/applicationApi'
import type {
  Application,
  ApplicationData,
  SortOrder,
  StatusFilter,
} from './types'
import './App.css'

function App() {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    async function loadApplications() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const savedApplications = await getApplications()
        setApplications(savedApplications)
      } catch {
        setErrorMessage(
          'Could not load applications. Please log in again.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadApplications()
  }, [user])

  if (!user) {
    return <AuthForm onAuthenticated={setUser} />
  }

  const interviewCount = applications.filter(
    (application) => application.status === 'Interview',
  ).length

  const offerCount = applications.filter(
    (application) => application.status === 'Offer',
  ).length

  const visibleApplications = applications
    .filter((application) => {
      const searchText = searchTerm.toLowerCase()

      const matchesSearch =
        application.company.toLowerCase().includes(searchText) ||
        application.role.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === 'All' || application.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((firstApplication, secondApplication) => {
      const firstDate = new Date(firstApplication.appliedDate).getTime()
      const secondDate = new Date(secondApplication.appliedDate).getTime()

      return sortOrder === 'newest'
        ? secondDate - firstDate
        : firstDate - secondDate
    })

  function openEditForm(application: Application) {
    setEditingApplication(application)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeForm() {
    setEditingApplication(null)
    setIsFormOpen(false)
  }

  async function handleSave(applicationData: ApplicationData) {
    try {
      setErrorMessage('')

      if (editingApplication) {
        const updated = await updateApplication(
          editingApplication.id,
          applicationData,
        )

        setApplications((current) =>
          current.map((application) =>
            application.id === updated.id ? updated : application,
          ),
        )
      } else {
        const created = await createApplication(applicationData)
        setApplications((current) => [...current, created])
      }

      closeForm()
    } catch {
      setErrorMessage('Could not save the application.')
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this application?')) {
      return
    }

    try {
      await deleteApplicationRequest(id)
      setApplications((current) =>
        current.filter((application) => application.id !== id),
      )
    } catch {
      setErrorMessage('Could not delete the application.')
    }
  }

  function handleLogout() {
    clearAuthentication()
    setUser(null)
    setApplications([])
    closeForm()
  }

  function clearFilters() {
    setSearchTerm('')
    setStatusFilter('All')
    setSortOrder('newest')
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PLACEMENT SEARCH</p>
          <h1>Placement Application Tracker</h1>
          <p>Signed in as {user.username}</p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>

          <button
            type="button"
            onClick={() => {
              if (isFormOpen) {
                closeForm()
              } else {
                setEditingApplication(null)
                setIsFormOpen(true)
              }
            }}
          >
            {isFormOpen ? 'Close form' : 'Add application'}
          </button>
        </div>
      </header>

      {errorMessage && (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      )}

      {isFormOpen && (
        <ApplicationForm
          key={editingApplication?.id ?? 'new'}
          editingApplication={editingApplication}
          onSave={handleSave}
        />
      )}

      <section className="stats">
        <article className="stat-card">
          <h2>{applications.length}</h2>
          <p>Total applications</p>
        </article>
        <article className="stat-card">
          <h2>{interviewCount}</h2>
          <p>Interviews</p>
        </article>
        <article className="stat-card">
          <h2>{offerCount}</h2>
          <p>Offers</p>
        </article>
      </section>

      <section className="applications">
        <div className="applications-heading">
          <div>
            <h2>Your applications</h2>
            <p>
              Showing {visibleApplications.length} of {applications.length}
            </p>
          </div>

          <button
            type="button"
            className="clear-button"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>

        <ApplicationFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          sortOrder={sortOrder}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onSortChange={setSortOrder}
        />

        {isLoading ? (
          <p className="loading-message">Loading applications...</p>
        ) : (
          <ApplicationTable
            applications={visibleApplications}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  )
}

export default App