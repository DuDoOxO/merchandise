import type { SortOption } from '../db/init'

interface Props {
  label: string
  sortKey: string
  sort: SortOption
  onSort: (s: SortOption) => void
}

export default function SortableHeader({ label, sortKey, sort, onSort }: Props) {
  const active = sort.key === sortKey
  const next = active && sort.dir === 'asc' ? 'desc' : 'asc'
  return (
    <th
      className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer select-none hover:text-blue-600 whitespace-nowrap"
      onClick={() => onSort({ key: sortKey, dir: next })}
    >
      {label}
      <span className="ml-1 text-xs">
        {active ? (sort.dir === 'asc' ? '↑' : '↓') : <span className="text-gray-300">↕</span>}
      </span>
    </th>
  )
}
