import type {
  Application,
  ApplicationData,
  ApplicationStatus,
} from '../types'
import { getToken } from './authApi'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8765/api'

const API_URL = `${API_BASE_URL}/applications/`

type ApiApplication = {
  id: number
  company: string
  role: string
  status: ApplicationStatus
  applied_date: string
  deadline: string | null
  job_url: string
  notes: string
}

function getHeaders() {
  const token = getToken()

  if (!token) {
    throw new Error('You must log in first.')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
}

function convertFromApi(application: ApiApplication): Application {
  return {
    id: application.id,
    company: application.company,
    role: application.role,
    status: application.status,
    appliedDate: application.applied_date,
    deadline: application.deadline,
    jobUrl: application.job_url,
    notes: application.notes,
  }
}

function convertToApi(application: ApplicationData) {
  return {
    company: application.company,
    role: application.role,
    status: application.status,
    applied_date: application.appliedDate,
    deadline: application.deadline || null,
    job_url: application.jobUrl,
    notes: application.notes,
  }
}

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
}

export async function getApplications(): Promise<Application[]> {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  })

  await checkResponse(response)

  const applications: ApiApplication[] = await response.json()

  return applications.map(convertFromApi)
}

export async function createApplication(
  application: ApplicationData,
): Promise<Application> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(convertToApi(application)),
  })

  await checkResponse(response)

  return convertFromApi(await response.json())
}

export async function updateApplication(
  id: number,
  application: ApplicationData,
): Promise<Application> {
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(convertToApi(application)),
  })

  await checkResponse(response)

  return convertFromApi(await response.json())
}

export async function deleteApplication(id: number): Promise<void> {
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  })

  await checkResponse(response)
}