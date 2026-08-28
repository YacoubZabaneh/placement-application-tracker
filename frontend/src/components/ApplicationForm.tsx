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
      deadline: String(formData.get('deadline')) || null,
      jobUrl: String(formData.get('jobUrl')),
      notes: String(formData.get('notes')),
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

        <label>
          Deadline
          <input
            type="date"
            name="deadline"
            defaultValue={editingApplication?.deadline ?? ''}
          />
        </label>

        <label>
          Job link
          <input
            type="url"
            name="jobUrl"
            placeholder="https://company.com/jobs/..."
            defaultValue={editingApplication?.jobUrl ?? ''}
          />
        </label>

        <label className="full-width">
          Notes
          <textarea
            name="notes"
            rows={4}
            placeholder="Interview details, contacts, or follow-up actions..."
            defaultValue={editingApplication?.notes ?? ''}
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