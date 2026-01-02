import { Task } from './api';
import { Trash2, CheckCircle, Circle, Calendar, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: 'Pending' | 'Completed') => Promise<void>;
  isLoading: boolean;
}

export function TaskCard({ task, onDelete, onStatusChange, isLoading }: TaskCardProps) {
  const priorityColors = {
    Low: 'bg-blue-100 text-blue-800 border-blue-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    High: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusColors = {
    Pending: 'text-yellow-600',
    Completed: 'text-green-600',
  };

  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const isOverdue = task.status === 'Pending' && dueDate < today;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 ${
      task.status === 'Completed' ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onStatusChange(task._id, task.status === 'Pending' ? 'Completed' : 'Pending')}
              disabled={isLoading}
              className={`flex-shrink-0 transition-colors ${statusColors[task.status]} hover:opacity-70 disabled:opacity-50`}
            >
              {task.status === 'Completed' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <h3 className={`text-lg font-semibold ${
              task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm ml-9 mb-3">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 ml-9">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
              {task.priority} Priority
            </span>
            <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              <Calendar className="w-4 h-4" />
              {formatDate(dueDate)}
              {isOverdue && <AlertCircle className="w-4 h-4" />}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task._id)}
          disabled={isLoading}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
