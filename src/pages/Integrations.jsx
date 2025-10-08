import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Switch } from '@headlessui/react';
import { 
  PuzzlePieceIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { integrations } from '../data/mockData';

const availableIntegrations = [
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    type: 'CRM',
    description: 'Sync leads and customer data with HubSpot',
    icon: '🎯',
    popular: true,
    status: 'available'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    type: 'Automation',
    description: 'Connect with 3000+ apps via Zapier',
    icon: '⚡',
    popular: true,
    status: 'available'
  },
  {
    id: 'slack',
    name: 'Slack',
    type: 'Communication',
    description: 'Get notifications in your Slack channels',
    icon: '💬',
    popular: false,
    status: 'available'
  },
  {
    id: 'googlecal',
    name: 'Google Calendar',
    type: 'Calendar',
    description: 'Sync appointments with Google Calendar',
    icon: '📅',
    popular: true,
    status: 'available'
  }
];

export const Integrations = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleConnect = (integration) => {
    setSelectedIntegration(integration);
    setShowConnectModal(true);
  };

  const handleConfigure = (integration) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
  };

  const handleToggleIntegration = (integrationId, currentStatus) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newStatus = currentStatus === 'connected' ? 'disconnected' : 'connected';
      showToast('success', `Integration ${newStatus} successfully`);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 dark:text-green-400';
      case 'disconnected':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'disconnected':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <PuzzlePieceIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Connect your favorite tools and services</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => showToast('info', 'Syncing all connected integrations...')}
          >
            Sync All
          </Button>
        </div>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connected</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {integrations.filter(i => i.status === 'connected').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{availableIntegrations.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Sync</h3>
          <p className="text-lg font-bold text-purple-600 mt-2">2 min ago</p>
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connected Integrations</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <PuzzlePieceIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{integration.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{integration.type}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last sync: {integration.lastSync}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${getStatusColor(integration.status)}`}>
                    {getStatusIcon(integration.status)}
                    <span className="text-sm font-medium capitalize">{integration.status}</span>
                  </div>
                  
                  <Switch
                    checked={integration.status === 'connected'}
                    onChange={() => handleToggleIntegration(integration.id, integration.status)}
                    className={`${
                      integration.status === 'connected' ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        integration.status === 'connected' ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleConfigure(integration)}
                    className="flex items-center space-x-2"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>Configure</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Integrations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Integrations</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{integration.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                        {integration.popular && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{integration.description}</p>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded text-xs font-medium mt-2">
                        {integration.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleConnect(integration)}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Connect</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connect Integration Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => {
          setShowConnectModal(false);
          setSelectedIntegration(null);
        }}
        title={`Connect ${selectedIntegration?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl">{selectedIntegration?.icon}</div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{selectedIntegration?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedIntegration?.description}</p>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setShowConnectModal(false);
              setSelectedIntegration(null);
              showToast('success', `${selectedIntegration?.name} connected successfully!`);
            }, 1500);
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Key
              </label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your API key"
                />
              </div>
            </div>
            
            {selectedIntegration?.type === 'CRM' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://your-account.hub-domain.com"
                />
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Permissions Required:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                <li>• Read and write contact information</li>
                <li>• Access appointment data</li>
                <li>• Sync customer interactions</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowConnectModal(false);
                  setSelectedIntegration(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Connect Integration
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Configure Integration Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedIntegration(null);
        }}
        title={`Configure ${selectedIntegration?.name}`}
        size="lg"
      >
        {selectedIntegration && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <PuzzlePieceIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{selectedIntegration.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedIntegration.type}</p>
              </div>
              <div className={`ml-auto flex items-center space-x-2 ${getStatusColor(selectedIntegration.status)}`}>
                {getStatusIcon(selectedIntegration.status)}
                <span className="text-sm font-medium capitalize">{selectedIntegration.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Sync Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto Sync</span>
                    <Switch
                      checked={true}
                      onChange={() => showToast('success', 'Auto sync updated')}
                      className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                    </Switch>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sync Leads</span>
                    <Switch
                      checked={true}
                      onChange={() => showToast('success', 'Lead sync updated')}
                      className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                    </Switch>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sync Appointments</span>
                    <Switch
                      checked={false}
                      onChange={() => showToast('success', 'Appointment sync updated')}
                      className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                    </Switch>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Sync Frequency</h4>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="realtime">Real-time</option>
                  <option value="5min">Every 5 minutes</option>
                  <option value="15min">Every 15 minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Last successful sync:</span>
                    <span className="text-gray-900 dark:text-white">{selectedIntegration.lastSync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Records synced:</span>
                    <span className="text-gray-900 dark:text-white">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sync status:</span>
                    <span className="text-green-600 dark:text-green-400">Healthy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="danger"
                onClick={() => {
                  showToast('warning', `${selectedIntegration.name} disconnected`);
                  setShowConfigModal(false);
                  setSelectedIntegration(null);
                }}
              >
                Disconnect
              </Button>
              <Button
                variant="secondary"
                onClick={() => showToast('success', 'Sync triggered manually')}
              >
                Sync Now
              </Button>
              <Button
                onClick={() => {
                  showToast('success', 'Configuration saved successfully');
                  setShowConfigModal(false);
                  setSelectedIntegration(null);
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