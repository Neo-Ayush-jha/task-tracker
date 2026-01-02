import { Filter, ArrowUpDown } from 'lucide-react';

interface FilterSortProps {
  statusFilter: 'All' | 'Pending' | 'Completed';
  priorityFilter: 'All' | 'Low' | 'Medium' | 'High';
  sortBy: 'dueDate' | 'created';
  onStatusChange: (status: 'All' | 'Pending' | 'Completed') => void;
  onPriorityChange: (priority: 'All' | 'Low' | 'Medium' | 'High') => void;
  onSortChange: (sort: 'dueDate' | 'created') => void;
}

export function FilterSort({
  statusFilter,
  priorityFilter,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: FilterSortProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-700" />
        <h3 className="font-semibold text-gray-900">Filters & Sort</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            <option value="dueDate">Due Date</option>
            <option value="created">Created Date</option>
          </select>
        </div>
      </div>
    </div>
  );
}
