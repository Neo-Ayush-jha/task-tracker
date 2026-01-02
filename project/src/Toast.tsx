import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 z-50`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <span className={`text-sm font-medium ${textColor}`}>{message}</span>
      <button
        onClick={onClose}
        className={`ml-2 ${textColor} hover:opacity-70`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
