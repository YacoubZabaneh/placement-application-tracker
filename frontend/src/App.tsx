import { useState, type FormEvent } from 'react'
import './App.css'

type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected'

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

  const interviewCount = applications.filter(
    (application) => application.status === 'Interview',
  ).length

  const offerCount = applications.filter(
    (application) => application.status === 'Offer',
  ).length

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
        <h2>Your applications</h2>

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
              {applications.map((application) => (
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
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App

