import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Table } from '../components/ui/Table';
import { 
  PlusIcon,
  TicketIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { tickets } from '../data/mockData';

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const statusColors = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

const statusIcons = {
  open: ExclamationTriangleIcon,
  'in-progress': ClockIcon,
  resolved: CheckCircleIcon,
  closed: CheckCircleIcon
};

export const Support = () => {
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const columns = [
    { key: 'id', label: 'ID', render: (id) => `#${id}` },
    { key: 'subject', label: 'Subject' },
    {
      key: 'priority',
      label: 'Priority',
      render: (priority) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]} capitalize`}>
          {priority}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const Icon = statusIcons[status];
        return (
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} capitalize`}>
              {status.replace('-', ' ')}
            </span>
          </div>
        );
      }
    },
    { key: 'assignee', label: 'Assignee' },
    { key: 'created', label: 'Created' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage support tickets and track issues</p>
        </div>
        <Button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Raise Ticket</span>
        </Button>
      </div>

      {/* Ticket Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Open Tickets</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TicketIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">In Progress</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {tickets.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">High Priority</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {tickets.filter(t => t.priority === 'high').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resolved</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Support Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <h3 className="font-medium text-gray-900 dark:text-white">Technical Issues</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Login problems, bugs, system errors</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <h3 className="font-medium text-gray-900 dark:text-white">Feature Requests</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">New features, improvements, suggestions</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <h3 className="font-medium text-gray-900 dark:text-white">General Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">General questions, how-to guides</p>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <Table
        columns={columns}
        data={tickets}
        searchable={true}
        onRowClick={handleViewTicket}
      />

      {/* New Ticket Modal */}
      <Modal
        isOpen={showNewTicketModal}
        onClose={() => setShowNewTicketModal(false)}
        title="Raise Support Ticket"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setShowNewTicketModal(false);
            showToast('success', 'Support ticket created successfully!');
          }, 1000);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the issue"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="technical">Technical Issue</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Support</option>
                <option value="billing">Billing</option>
                <option value="integration">Integration</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows="5"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide detailed information about the issue, including steps to reproduce if applicable..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachments
            </label>
            <input
              type="file"
              multiple
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Attach screenshots, logs, or other relevant files (max 5MB each)
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowNewTicketModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Ticket Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTicket(null);
        }}
        title={`Ticket #${selectedTicket?.id}`}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-6">
            {/* Ticket Header */}
            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{selectedTicket.subject}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Created on {selectedTicket.created}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[selectedTicket.priority]} capitalize`}>
                  {selectedTicket.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedTicket.status]} capitalize`}>
                  {selectedTicket.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Ticket Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Assignee:</span>
                    <span className="text-gray-900 dark:text-white">{selectedTicket.assignee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Priority:</span>
                    <span className="text-gray-900 dark:text-white capitalize">{selectedTicket.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <span className="text-gray-900 dark:text-white capitalize">{selectedTicket.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Actions</h4>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => showToast('success', 'Ticket status updated')}
                    className="w-full"
                  >
                    Update Status
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showToast('info', 'Added comment to ticket')}
                    className="w-full"
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>

            {/* Ticket Description */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  This is a sample ticket description. In a real application, this would contain
                  the actual ticket content provided by the user when creating the ticket.
                  It might include detailed steps to reproduce an issue, screenshots,
                  or other relevant information.
                </p>
              </div>
            </div>

            {/* Comments/Activity */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Activity</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Ticket created by Admin User
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{selectedTicket.created}</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Assigned to {selectedTicket.assignee}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedTicket(null);
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  showToast('success', 'Ticket resolved successfully');
                  setShowViewModal(false);
                  setSelectedTicket(null);
                }}
              >
                Mark as Resolved
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};