import type { Application } from '../types'

type ApplicationTableProps = {
  applications: Application[]
  onEdit: (application: Application) => void
  onDelete: (id: number) => void
}

function formatDate(date: string | null) {
  if (!date) {
    return '—'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ApplicationTable({
  applications,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Deadline</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.company}</td>
              <td>
                {application.role}
                {application.notes && (
                  <small className="role-notes">
                    {application.notes}
                  </small>
                )}
              </td>
              <td>
                <span
                  className={`status status-${application.status.toLowerCase()}`}
                >
                  {application.status}
                </span>
              </td>
              <td>{formatDate(application.appliedDate)}</td>
              <td>{formatDate(application.deadline)}</td>
              <td>
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View role
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td>
                <div className="actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => onEdit(application)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => onDelete(application.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {applications.length === 0 && (
            <tr>
              <td className="empty-state" colSpan={7}>
                No applications match your search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ApplicationTable