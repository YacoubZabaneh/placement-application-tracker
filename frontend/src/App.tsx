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
    appliedDate: '25 August 2026',
  },
  {
    id: 2,
    company: 'IBM',
    role: 'Technology Placement',
    status: 'Interview',
    appliedDate: '20 August 2026',
  },
  {
    id: 3,
    company: 'Microsoft',
    role: 'Software Engineer Intern',
    status: 'Offer',
    appliedDate: '14 August 2026',
  },
]

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [applications, setApplications] =
    useState<Application[]>(initialApplications)

  const interviewCount = applications.filter(
    (application) => application.status === 'Interview',
  ).length

  const offerCount = applications.filter(
    (application) => application.status === 'Offer',
  ).length

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const selectedDate = String(formData.get('appliedDate'))

    const formattedDate = new Date(
      `${selectedDate}T00:00:00`,
    ).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const newApplication: Application = {
      id: Date.now(),
      company: String(formData.get('company')),
      role: String(formData.get('role')),
      status: String(formData.get('status')) as ApplicationStatus,
      appliedDate: formattedDate,
    }

    setApplications((currentApplications) => [
      ...currentApplications,
      newApplication,
    ])

    form.reset()
    setIsFormOpen(false)
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
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PLACEMENT SEARCH</p>
          <h1>Placement Application Tracker</h1>
          <p>Organise your applications, interviews, deadlines, and offers.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((currentValue) => !currentValue)}
        >
          {isFormOpen ? 'Close form' : 'Add application'}
        </button>
      </header>

      {isFormOpen && (
        <section className="application-form">
          <h2>Add a new application</h2>

          <form onSubmit={handleSubmit}>
            <label>
              Company
              <input
                type="text"
                name="company"
                placeholder="e.g. Bloomberg"
                required
              />
            </label>

            <label>
              Role
              <input
                type="text"
                name="role"
                placeholder="e.g. Software Engineering Placement"
                required
              />
            </label>

            <label>
              Status
              <select name="status" defaultValue="Applied">
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>

            <label>
              Application date
              <input type="date" name="appliedDate" required />
            </label>

            <button type="submit">Save application</button>
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
                  <td>{application.appliedDate}</td>
                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(application.id)}
                    >
                      Delete
                    </button>
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

