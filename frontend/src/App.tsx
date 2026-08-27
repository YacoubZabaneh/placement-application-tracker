import './App.css'

type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected'

type Application = {
  id: number
  company: string
  role: string
  status: ApplicationStatus
  appliedDate: string
}

const applications: Application[] = [
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
  const interviewCount = applications.filter(
    (application) => application.status === 'Interview',
  ).length

  const offerCount = applications.filter(
    (application) => application.status === 'Offer',
  ).length

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PLACEMENT SEARCH</p>
          <h1>Placement Application Tracker</h1>
          <p>Organise your applications, interviews, deadlines, and offers.</p>
        </div>

        <button type="button">Add application</button>
      </header>

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
              </tr>
            </thead>

            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.company}</td>
                  <td>{application.role}</td>
                  <td>
                    <span className={`status status-${application.status.toLowerCase()}`}>
                      {application.status}
                    </span>
                  </td>
                  <td>{application.appliedDate}</td>
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

