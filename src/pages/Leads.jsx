import React, { useState } from 'react';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon, PlusIcon } from '@heroicons/react/24/outline';
import { leads } from '../data/mockData';
import { saveAs } from 'file-saver';

export const Leads = () => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleStatusUpdate = (leadId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('success', `Lead status updated to ${newStatus}`);
    }, 500);
  };

  const handleBulkExport = () => {
    const selectedData = leads.filter(lead => selectedLeads.includes(lead.id));
    const csvContent = "Name,Email,Phone,Status,Source,Created,Score\n" + 
      selectedData.map(lead => `${lead.name},${lead.email},${lead.phone},${lead.status},${lead.source},${lead.created},${lead.score}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'leads-bulk-export.csv');
    showToast('success', `${selectedData.length} leads exported successfully!`);
  };

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedLeads(leads.map(lead => lead.id));
            } else {
              setSelectedLeads([]);
            }
          }}
          checked={selectedLeads.length === leads.length}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (_, lead) => (
        <input
          type="checkbox"
          checked={selectedLeads.includes(lead.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedLeads([...selectedLeads, lead.id]);
            } else {
              setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
            }
          }}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )
    },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (value, lead) => (
        <Menu as="div" className="relative">
          <Menu.Button as="div">
            <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
              value === 'new' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
              value === 'in-progress' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
              value === 'qualified' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}>
              {value}
            </span>
          </Menu.Button>
          <Menu.Items className="absolute z-10 mt-1 w-32 origin-top-left bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
            {['new', 'in-progress', 'qualified', 'closed'].map((status) => (
              <Menu.Item key={status}>
                <button
                  onClick={() => handleStatusUpdate(lead.id, status)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 capitalize"
                >
                  {status.replace('-', ' ')}
                </button>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      )
    },
    { key: 'source', label: 'Source' },
    { key: 'created', label: 'Created' },
    {
      key: 'score',
      label: 'Score',
      render: (value) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
            <div
              className={`h-2 rounded-full ${
                value >= 80 ? 'bg-green-500' :
                value >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, lead) => (
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <EllipsisVerticalIcon className="w-4 h-4" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-1 w-32 origin-top-right bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              <button
                onClick={() => {
                  setEditingLead(lead);
                  setShowEditModal(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Edit
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => showToast('success', `Lead ${lead.name} contacted`)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Contact
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => showToast('warning', `Lead ${lead.name} archived`)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Archive
              </button>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your leads efficiently</p>
        </div>
        <div className="flex space-x-3">
          {selectedLeads.length > 0 && (
            <Button
              variant="secondary"
              onClick={handleBulkExport}
              className="flex items-center space-x-2"
            >
              <span>Export Selected ({selectedLeads.length})</span>
            </Button>
          )}
          <Button
            onClick={() => setShowNewLeadModal(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Leads</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{leads.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Leads</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {leads.filter(l => l.status === 'new').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Qualified</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {leads.filter(l => l.status === 'qualified').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conversion Rate</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">23.4%</p>
        </div>
      </div>

      {/* Leads Table */}
      <Table
        columns={columns}
        data={leads}
        searchable={true}
        exportable={true}
        onExport={(data) => {
          const csvContent = "Name,Email,Phone,Status,Source,Created,Score\n" + 
            data.map(lead => `${lead.name},${lead.email},${lead.phone},${lead.status},${lead.source},${lead.created},${lead.score}`).join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, 'all-leads-export.csv');
          showToast('success', 'All leads exported successfully!');
        }}
        onRowClick={(lead) => {
          setEditingLead(lead);
          setShowEditModal(true);
        }}
      />

      {/* New Lead Modal */}
      <Modal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        title="Add New Lead"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setShowNewLeadModal(false);
            showToast('success', 'New lead added successfully!');
          }, 1000);
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
                <option>Direct</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowNewLeadModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add Lead
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingLead(null);
        }}
        title="Edit Lead"
        size="md"
      >
        {editingLead && (
          <form onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setShowEditModal(false);
              setEditingLead(null);
              showToast('success', 'Lead updated successfully!');
            }, 1000);
          }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={editingLead.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={editingLead.email}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue={editingLead.phone}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  defaultValue={editingLead.status}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingLead(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update Lead
              </Button>
            </div>
          </form>
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