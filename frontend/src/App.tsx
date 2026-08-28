import { useEffect, useState } from 'react'
import ApplicationFilters from './components/ApplicationFilters'
import ApplicationForm from './components/ApplicationForm'
import ApplicationTable from './components/ApplicationTable'
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
    async function loadApplications() {
      try {
        setErrorMessage('')
        const savedApplications = await getApplications()
        setApplications(savedApplications)
      } catch {
        setErrorMessage(
          'Could not load applications. Make sure the Django server is running.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadApplications()
  }, [])

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

  function openNewApplicationForm() {
    setEditingApplication(null)
    setIsFormOpen(true)
  }

  function openEditForm(application: Application) {
    setEditingApplication(application)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeForm() {
    setEditingApplication(null)
    setIsFormOpen(false)
  }

  function handleFormButton() {
    if (isFormOpen) {
      closeForm()
    } else {
      openNewApplicationForm()
    }
  }

  async function handleSave(applicationData: ApplicationData) {
    try {
      setErrorMessage('')

      if (editingApplication) {
        const updatedApplication = await updateApplication(
          editingApplication.id,
          applicationData,
        )

        setApplications((currentApplications) =>
          currentApplications.map((application) =>
            application.id === updatedApplication.id
              ? updatedApplication
              : application,
          ),
        )
      } else {
        const createdApplication =
          await createApplication(applicationData)

        setApplications((currentApplications) => [
          ...currentApplications,
          createdApplication,
        ])
      }

      closeForm()
    } catch {
      setErrorMessage(
        'Could not save the application. Please try again.',
      )
    }
  }

  async function handleDelete(id: number) {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this application?',
    )

    if (!shouldDelete) {
      return
    }

    try {
      setErrorMessage('')
      await deleteApplicationRequest(id)

      setApplications((currentApplications) =>
        currentApplications.filter((application) => application.id !== id),
      )

      if (editingApplication?.id === id) {
        closeForm()
      }
    } catch {
      setErrorMessage(
        'Could not delete the application. Please try again.',
      )
    }
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
          <p>Organise your applications, interviews, deadlines, and offers.</p>
        </div>

        <button type="button" onClick={handleFormButton}>
          {isFormOpen ? 'Close form' : 'Add application'}
        </button>
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

      <section className="stats" aria-label="Application summary">
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