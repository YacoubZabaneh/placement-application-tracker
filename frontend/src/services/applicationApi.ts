import type {
  Application,
  ApplicationData,
  ApplicationStatus,
} from '../types'

const API_URL = 'http://127.0.0.1:8765/api/applications/'

type ApiApplication = {
  id: number
  company: string
  role: string
  status: ApplicationStatus
  applied_date: string
}

function convertFromApi(application: ApiApplication): Application {
  return {
    id: application.id,
    company: application.company,
    role: application.role,
    status: application.status,
    appliedDate: application.applied_date,
  }
}

function convertToApi(application: ApplicationData) {
  return {
    company: application.company,
    role: application.role,
    status: application.status,
    applied_date: application.appliedDate,
  }
}

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
}

export async function getApplications(): Promise<Application[]> {
  const response = await fetch(API_URL)

  await checkResponse(response)

  const applications: ApiApplication[] = await response.json()

  return applications.map(convertFromApi)
}

export async function createApplication(
  application: ApplicationData,
): Promise<Application> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(convertToApi(application)),
  })

  await checkResponse(response)

  const createdApplication: ApiApplication = await response.json()

  return convertFromApi(createdApplication)
}

export async function updateApplication(
  id: number,
  application: ApplicationData,
): Promise<Application> {
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(convertToApi(application)),
  })

  await checkResponse(response)

  const updatedApplication: ApiApplication = await response.json()

  return convertFromApi(updatedApplication)
}

export async function deleteApplication(id: number): Promise<void> {
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'DELETE',
  })

  await checkResponse(response)
}