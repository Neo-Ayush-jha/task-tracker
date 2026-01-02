import { useState, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import { taskAPI, Task, CreateTaskPayload } from './api';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { FilterSort } from './FilterSort';
import { Toast } from './Toast';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'created'>('dueDate');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsFetching(true);
      const data = await taskAPI.getAllTasks();
      setTasks(data);
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskPayload) => {
    try {
      setIsLoading(true);
      const newTask = await taskAPI.createTask(taskData);
      setTasks([newTask, ...tasks]);
      showToast('Task created successfully', 'success');
    } catch (error) {
      showToast('Failed to create task', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
      showToast('Task deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete task', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'Completed') => {
    try {
      setIsLoading(true);
      const updatedTask = await taskAPI.updateTask(id, { status: newStatus });
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      showToast(`Task marked as ${newStatus}`, 'success');
    } catch (error) {
      showToast('Failed to update task', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (statusFilter !== 'All' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <CheckSquare className="w-4z h-4 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Task Tracker</h1>
          </div>
          <p className="text-gray-600 text-lg">Organize your tasks efficiently and stay productive</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-yellow-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TaskForm onSubmit={handleCreateTask} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <FilterSort
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              sortBy={sortBy}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onSortChange={setSortBy}
            />

            {isFetching ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading tasks...</p>
              </div>
            ) : filteredAndSortedTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  {tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'No tasks match your filters.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <footer className="mt-12 text-center py-6 border-t border-gray-200 text-gray-600">
        <p className="text-sm">
          Built by{' '}
          <a
            href="https://ayush-jha.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors"
          >
            Ayush Jha
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
