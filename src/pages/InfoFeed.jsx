import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Table } from '../components/ui/Table';
import { Menu } from '@headlessui/react';
import { 
  PlusIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  SpeakerWaveIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { faqs } from '../data/mockData';

export const InfoFeed = () => {
  const [activeTab, setActiveTab] = useState('faqs');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const tabs = [
    { id: 'faqs', name: 'FAQs', icon: QuestionMarkCircleIcon },
    { id: 'schedules', name: 'Schedules', icon: ClockIcon },
    { id: 'announcements', name: 'Announcements', icon: SpeakerWaveIcon }
  ];

  const schedules = [
    { id: 1, title: 'Operating Hours', content: 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM', status: 'active', category: 'general' },
    { id: 2, title: 'Emergency Contact', content: '24/7 Emergency: +1-555-HELP', status: 'active', category: 'emergency' },
    { id: 3, title: 'Holiday Schedule', content: 'Closed on New Year\'s Day and Christmas', status: 'active', category: 'holidays' }
  ];

  const announcements = [
    { id: 1, title: 'System Maintenance', content: 'Scheduled maintenance on Saturday 2-4 AM', status: 'active', category: 'system' },
    { id: 2, title: 'New Services Available', content: 'We now offer online consultations', status: 'active', category: 'services' },
    { id: 3, title: 'Policy Update', content: 'Updated privacy policy effective immediately', status: 'active', category: 'policy' }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'faqs':
        return faqs;
      case 'schedules':
        return schedules;
      case 'announcements':
        return announcements;
      default:
        return [];
    }
  };

  const getColumns = () => {
    const baseColumns = [
      activeTab === 'faqs' 
        ? { key: 'question', label: 'Question' }
        : { key: 'title', label: 'Title' },
      activeTab === 'faqs'
        ? { key: 'answer', label: 'Answer', render: (value) => (
            <div className="max-w-xs truncate" title={value}>
              {value}
            </div>
          )}
        : { key: 'content', label: 'Content', render: (value) => (
            <div className="max-w-xs truncate" title={value}>
              {value}
            </div>
          )},
      { key: 'category', label: 'Category', render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium capitalize">
          {value}
        </span>
      )},
      { 
        key: 'status', 
        label: 'Status', 
        render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
          }`}>
            {value}
          </span>
        )
      },
      {
        key: 'actions',
        label: 'Actions',
        render: (_, item) => (
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 z-10 mt-1 w-32 origin-top-right bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setShowEditModal(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  onClick={() => showToast('warning', `${activeTab.slice(0, -1)} archived`)}
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

    return baseColumns;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowNewModal(false);
      setShowEditModal(false);
      setEditingItem(null);
      showToast('success', `${activeTab.slice(0, -1)} ${editingItem ? 'updated' : 'created'} successfully!`);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Information Feed</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage FAQs, schedules, and announcements</p>
        </div>
        <Button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add {activeTab.slice(0, -1)}</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                    {getCurrentData().length}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          <Table
            columns={getColumns()}
            data={getCurrentData()}
            searchable={true}
            onRowClick={(item) => {
              setEditingItem(item);
              setShowEditModal(true);
            }}
          />
        </div>
      </div>

      {/* New Item Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title={`Add New ${activeTab.slice(0, -1)}`}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {activeTab === 'faqs' ? 'Question' : 'Title'}
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {activeTab === 'faqs' ? 'Answer' : 'Content'}
            </label>
            <textarea
              rows="4"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {activeTab === 'faqs' && (
                <>
                  <option value="general">General</option>
                  <option value="appointments">Appointments</option>
                  <option value="visiting">Visiting</option>
                  <option value="billing">Billing</option>
                </>
              )}
              {activeTab === 'schedules' && (
                <>
                  <option value="general">General</option>
                  <option value="emergency">Emergency</option>
                  <option value="holidays">Holidays</option>
                  <option value="special">Special Hours</option>
                </>
              )}
              {activeTab === 'announcements' && (
                <>
                  <option value="system">System</option>
                  <option value="services">Services</option>
                  <option value="policy">Policy</option>
                  <option value="general">General</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowNewModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add {activeTab.slice(0, -1)}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        title={`Edit ${activeTab.slice(0, -1)}`}
        size="md"
      >
        {editingItem && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {activeTab === 'faqs' ? 'Question' : 'Title'}
              </label>
              <input
                type="text"
                defaultValue={activeTab === 'faqs' ? editingItem.question : editingItem.title}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {activeTab === 'faqs' ? 'Answer' : 'Content'}
              </label>
              <textarea
                rows="4"
                defaultValue={activeTab === 'faqs' ? editingItem.answer : editingItem.content}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                defaultValue={editingItem.category}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {activeTab === 'faqs' && (
                  <>
                    <option value="general">General</option>
                    <option value="appointments">Appointments</option>
                    <option value="visiting">Visiting</option>
                    <option value="billing">Billing</option>
                  </>
                )}
                {activeTab === 'schedules' && (
                  <>
                    <option value="general">General</option>
                    <option value="emergency">Emergency</option>
                    <option value="holidays">Holidays</option>
                    <option value="special">Special Hours</option>
                  </>
                )}
                {activeTab === 'announcements' && (
                  <>
                    <option value="system">System</option>
                    <option value="services">Services</option>
                    <option value="policy">Policy</option>
                    <option value="general">General</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                defaultValue={editingItem.status}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update {activeTab.slice(0, -1)}
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