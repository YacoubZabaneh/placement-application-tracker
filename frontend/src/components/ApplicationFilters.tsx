import type { SortOrder, StatusFilter } from '../types'

type ApplicationFiltersProps = {
  searchTerm: string
  statusFilter: StatusFilter
  sortOrder: SortOrder
  onSearchChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
  onSortChange: (value: SortOrder) => void
}

function ApplicationFilters({
  searchTerm,
  statusFilter,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: ApplicationFiltersProps) {
  return (
    <div className="filters">
      <label>
        Search
        <input
          type="search"
          placeholder="Search company or role"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label>
        Status
        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as StatusFilter)
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
            onSortChange(event.target.value as SortOrder)
          }
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </label>
    </div>
  )
}

export default ApplicationFilters