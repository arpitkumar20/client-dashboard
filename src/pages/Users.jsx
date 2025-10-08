import React, { useState } from 'react';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Menu, Switch } from '@headlessui/react';
import { 
  PlusIcon, 
  UserIcon, 
  ShieldCheckIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { users } from '../data/mockData';

const rolePermissions = {
  admin: {
    name: 'Administrator',
    permissions: ['all_access', 'user_management', 'system_settings', 'reports', 'billing'],
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  },
  manager: {
    name: 'Manager',
    permissions: ['leads_management', 'appointments', 'reports', 'staff_management'],
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  'front-desk': {
    name: 'Front Desk',
    permissions: ['appointments', 'basic_leads', 'customer_info'],
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  support: {
    name: 'Support',
    permissions: ['tickets', 'customer_support', 'knowledge_base'],
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  }
};

export const Users = () => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleStatusToggle = (userId) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('success', 'User status updated successfully');
    }, 500);
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (name, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (role) => {
        const roleConfig = rolePermissions[role];
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleConfig?.color || 'bg-gray-100 text-gray-800'}`}>
            {roleConfig?.name || role}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (status, user) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={status === 'active'}
            onChange={() => handleStatusToggle(user.id)}
            className={`${
              status === 'active' ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
          >
            <span
              aria-hidden="true"
              className={`${
                status === 'active' ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className={`text-sm font-medium ${
            status === 'active' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {status}
          </span>
        </div>
      )
    },
    { key: 'lastLogin', label: 'Last Login' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user) => (
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <EllipsisVerticalIcon className="w-4 h-4" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-1 w-48 origin-top-right bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              <button
                onClick={() => {
                  setEditingUser(user);
                  setShowEditModal(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Edit User
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => {
                  setEditingUser(user);
                  setShowPermissionsModal(true);
                }}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Manage Permissions
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => showToast('success', `Password reset sent to ${user.email}`)}
                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Reset Password
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => showToast('warning', `User ${user.name} deactivated`)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Deactivate User
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Access Control</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage staff roles and permissions</p>
        </div>
        <Button
          onClick={() => setShowNewUserModal(true)}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add User</span>
        </Button>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(rolePermissions).map(([roleKey, roleConfig]) => {
          const userCount = users.filter(user => user.role === roleKey).length;
          return (
            <div key={roleKey} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {roleConfig.name}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{userCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {roleConfig.permissions.length} permissions
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <Table
        columns={columns}
        data={users}
        searchable={true}
        onRowClick={(user) => {
          setEditingUser(user);
          setShowEditModal(true);
        }}
      />

      {/* New User Modal */}
      <Modal
        isOpen={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        title="Add New User"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setShowNewUserModal(false);
            showToast('success', 'New user added successfully!');
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {Object.entries(rolePermissions).map(([roleKey, roleConfig]) => (
                <option key={roleKey} value={roleKey}>
                  {roleConfig.name}
                </option>
              ))}
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
              onClick={() => setShowNewUserModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Edit User"
        size="md"
      >
        {editingUser && (
          <form onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setShowEditModal(false);
              setEditingUser(null);
              showToast('success', 'User updated successfully!');
            }, 1000);
          }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={editingUser.name}
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
                  defaultValue={editingUser.email}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                defaultValue={editingUser.role}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(rolePermissions).map(([roleKey, roleConfig]) => (
                  <option key={roleKey} value={roleKey}>
                    {roleConfig.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                defaultValue={editingUser.status}
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
                  setEditingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update User
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Permissions Modal */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={() => {
          setShowPermissionsModal(false);
          setEditingUser(null);
        }}
        title="Manage Permissions"
        size="lg"
      >
        {editingUser && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{editingUser.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{editingUser.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                rolePermissions[editingUser.role]?.color || 'bg-gray-100 text-gray-800'
              }`}>
                {rolePermissions[editingUser.role]?.name || editingUser.role}
              </span>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Current Permissions</h4>
              <div className="grid grid-cols-1 gap-3">
                {rolePermissions[editingUser.role]?.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {permission.replace('_', ' ')}
                      </span>
                    </div>
                    <Switch
                      checked={true}
                      onChange={() => showToast('success', 'Permission updated')}
                      className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                    </Switch>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPermissionsModal(false);
                  setEditingUser(null);
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  showToast('success', 'Permissions updated successfully');
                  setShowPermissionsModal(false);
                  setEditingUser(null);
                }}
              >
                Save Changes
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