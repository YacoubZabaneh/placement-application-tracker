export type ApplicationStatus =
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected'

export type StatusFilter = 'All' | ApplicationStatus
export type SortOrder = 'newest' | 'oldest'

export type Application = {
  id: number
  company: string
  role: string
  status: ApplicationStatus
  appliedDate: string
}

export type ApplicationData = Omit<Application, 'id'>