import React, { useEffect, useState } from 'react';
import { XCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface NotificationProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({ id, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Allow fade-out animation
    }, 5000); // Notification stays for 5 seconds

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-orange-500',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center space-x-3 p-4 rounded-lg shadow-lg text-white transform transition-all duration-300
        ${bgColor} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <Icon className="w-6 h-6" />
      <p className="font-medium">{message}</p>
      <button onClick={() => setIsVisible(false)} className="ml-auto p-1 rounded-full hover:bg-white hover:bg-opacity-20">
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;