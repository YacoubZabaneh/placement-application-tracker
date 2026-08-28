import type { FormEvent } from 'react'
import type {
  Application,
  ApplicationData,
  ApplicationStatus,
} from '../types'

type ApplicationFormProps = {
  editingApplication: Application | null
  onSave: (application: ApplicationData) => void
}

function ApplicationForm({
  editingApplication,
  onSave,
}: ApplicationFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const applicationData: ApplicationData = {
      company: String(formData.get('company')),
      role: String(formData.get('role')),
      status: String(formData.get('status')) as ApplicationStatus,
      appliedDate: String(formData.get('appliedDate')),
    }

    onSave(applicationData)
  }

  return (
    <section className="application-form">
      <h2>
        {editingApplication ? 'Edit application' : 'Add a new application'}
      </h2>

      <form onSubmit={handleSubmit}>
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
          {editingApplication ? 'Update application' : 'Save application'}
        </button>
      </form>
    </section>
  )
}

export default ApplicationForm