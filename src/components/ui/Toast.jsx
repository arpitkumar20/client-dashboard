import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const toastTypes = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-800 dark:text-green-200'
  },
  error: {
    icon: XCircleIcon,
    bgColor: 'bg-red-100 dark:bg-red-900',
    iconColor: 'text-red-600 dark:text-red-400',
    textColor: 'text-red-800 dark:text-red-200'
  },
  warning: {
    icon: ExclamationCircleIcon,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    textColor: 'text-yellow-800 dark:text-yellow-200'
  }
};

export const Toast = ({ type = 'success', message, isVisible, onClose, duration = 3000 }) => {
  const [show, setShow] = useState(isVisible);
  const config = toastTypes[type];
  const Icon = config.icon;

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${config.bgColor} border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm`}>
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${config.iconColor} mr-3`} />
          <p className={`${config.textColor} text-sm font-medium`}>{message}</p>
          <button
            onClick={() => {
              setShow(false);
              onClose?.();
            }}
            className={`ml-4 ${config.textColor} hover:opacity-75`}
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};