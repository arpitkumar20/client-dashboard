import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  type = "danger" // danger, warning, info
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <TrashIcon className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      default:
        return <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'danger':
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case 'warning':
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              loading={loading}
              className={`text-white ${getButtonStyle()}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};