import { useState, type FormEvent } from 'react'
import './App.css'

type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected'
type StatusFilter = 'All' | ApplicationStatus
type SortOrder = 'newest' | 'oldest'

type Application = {
  id: number
  company: string
  role: string
  status: ApplicationStatus
  appliedDate: string
}

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const applicationData = {
      company: String(formData.get('company')),
      role: String(formData.get('role')),
      status: String(formData.get('status')) as ApplicationStatus,
      appliedDate: String(formData.get('appliedDate')),
    }

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

    form.reset()
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

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
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
        <section className="application-form">
          <h2>
            {editingApplication
              ? 'Edit application'
              : 'Add a new application'}
          </h2>

          <form
            key={editingApplication?.id ?? 'new'}
            onSubmit={handleSubmit}
          >
            <label>
              Company
              <input
                type="text"
                name="company"
                placeholder="e.g. Bloomberg"
                defaultValue={editingApplication?.company ?? ''}
                required
              />
            </label>

            <label>
              Role
              <input
                type="text"
                name="role"
                placeholder="e.g. Software Engineering Placement"
                defaultValue={editingApplication?.role ?? ''}
                required
              />
            </label>

            <label>
              Status
              <select
                name="status"
                defaultValue={editingApplication?.status ?? 'Applied'}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>

            <label>
              Application date
              <input
                type="date"
                name="appliedDate"
                defaultValue={editingApplication?.appliedDate ?? ''}
                required
              />
            </label>

            <button type="submit">
              {editingApplication
                ? 'Update application'
                : 'Save application'}
            </button>
          </form>
        </section>
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

        <div className="filters">
          <label>
            Search
            <input
              type="search"
              placeholder="Search company or role"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label>
            Status
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              <option value="All">All statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>

          <label>
            Sort by date
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleApplications.map((application) => (
                <tr key={application.id}>
                  <td>{application.company}</td>
                  <td>{application.role}</td>
                  <td>
                    <span
                      className={`status status-${application.status.toLowerCase()}`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td>{formatDate(application.appliedDate)}</td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => openEditForm(application)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(application.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleApplications.length === 0 && (
                <tr>
                  <td className="empty-state" colSpan={5}>
                    No applications match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App