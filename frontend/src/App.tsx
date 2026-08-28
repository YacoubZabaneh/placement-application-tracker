import { useState } from 'react'
import ApplicationFilters from './components/ApplicationFilters'
import ApplicationForm from './components/ApplicationForm'
import ApplicationTable from './components/ApplicationTable'
import type {
  Application,
  ApplicationData,
  SortOrder,
  StatusFilter,
} from './types'
import './App.css'

const initialApplications: Application[] = [
  {
    id: 1,
    company: 'Bloomberg',
    role: 'Software Engineering Placement',
    status: 'Applied',
    appliedDate: '2026-08-25',
  },
  {
    id: 2,
    company: 'IBM',
    role: 'Technology Placement',
    status: 'Interview',
    appliedDate: '2026-08-20',
  },
  {
    id: 3,
    company: 'Microsoft',
    role: 'Software Engineer Intern',
    status: 'Offer',
    appliedDate: '2026-08-14',
  },
]

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null)
  const [applications, setApplications] =
    useState<Application[]>(initialApplications)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

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

  function handleSave(applicationData: ApplicationData) {
    if (editingApplication) {
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === editingApplication.id
            ? { ...applicationData, id: editingApplication.id }
            : application,
        ),
      )
    } else {
      const newApplication: Application = {
        id: Date.now(),
        ...applicationData,
      }

      setApplications((currentApplications) => [
        ...currentApplications,
        newApplication,
      ])
    }

    closeForm()
  }

  function handleDelete(id: number) {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this application?',
    )

    if (!shouldDelete) {
      return
    }

    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== id),
    )

    if (editingApplication?.id === id) {
      closeForm()
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

        <ApplicationTable
          applications={visibleApplications}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </section>
    </main>
  )
}

export default App