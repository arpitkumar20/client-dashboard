import React, { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import {
  PuzzlePieceIcon,
  LinkIcon,
  Cog6ToothIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
  CircleStackIcon,
  CloudIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { LoadingSkeleton } from '../components/ui/LoadingSpinner';
import { integrationService } from '../services/integrationService';
import { formatDistanceToNow } from 'date-fns';

const CONNECTOR_TYPES = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'zoho', label: 'Zoho' },
  { value: 'salesforce', label: 'Salesforce' },
];

export const Integrations = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);
  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [createType, setCreateType] = useState('postgresql');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent | type-asc | type-desc
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // visibility toggles for sensitive fields
  const [showPgPassword, setShowPgPassword] = useState(false);
  const [showZohoClientSecret, setShowZohoClientSecret] = useState(false);
  const [showZohoRefreshToken, setShowZohoRefreshToken] = useState(false);
  const [showSfPassword, setShowSfPassword] = useState(false);
  const [showSfClientSecret, setShowSfClientSecret] = useState(false);

  const resetVisibilityToggles = () => {
    setShowPgPassword(false);
    setShowZohoClientSecret(false);
    setShowZohoRefreshToken(false);
    setShowSfPassword(false);
    setShowSfClientSecret(false);
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  // Load integrations from API
  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await integrationService.listIntegrations();
        // API may return an array or object, normalize to array
        const list = Array.isArray(data) ? data : data.data || [];
        if (mounted) setConnectedIntegrations(list);
      } catch (err) {
        console.error('Failed to load integrations', err);
        showToast('error', 'Failed to load integrations from server');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleConnect = () => {
    setSelectedIntegration(null);
    setCreateType('postgresql');
    resetVisibilityToggles();
    setShowConnectModal(true);
  };

  const handleConfigure = (integration) => {
    setSelectedIntegration(integration);
    resetVisibilityToggles();
    setShowConfigModal(true);
  };

  const refreshList = async () => {
    setLoading(true);
    try {
      const data = await integrationService.listIntegrations();
      const list = Array.isArray(data) ? data : data.data || [];
      setConnectedIntegrations(list);
    } catch (err) {
      console.error('Refresh failed', err);
      showToast('error', 'Failed to refresh integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntegration = async (connectorType, config) => {
    setLoading(true);
    try {
      const payload = { connector_type: connectorType, config };
      await integrationService.createIntegration(payload);
      showToast('success', 'Integration created');
      setShowConnectModal(false);
      await refreshList();
    } catch (err) {
      console.error('Create failed', err);
      showToast('error', 'Failed to create integration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIntegration = async (id, updates) => {
    setLoading(true);
    try {
      await integrationService.updateIntegration(id, updates);
      showToast('success', 'Integration updated');
      setShowConfigModal(false);
      await refreshList();
    } catch (err) {
      console.error('Update failed', err);
      showToast('error', 'Failed to update integration');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIntegration = async (id) => {
    setLoading(true);
    try {
      await integrationService.deleteIntegration(id);
      showToast('success', 'Integration deleted');
      await refreshList();
    } catch (err) {
      console.error('Delete failed', err);
      showToast('error', 'Failed to delete integration');
    } finally {
      setLoading(false);
    }
  };

  // No toggle in simplified UI

  const getId = (item) => item?.id || item?._id || item?.integration_id || item?.uuid;

  const mask = (v) => (v ? '•'.repeat(String(v).length > 6 ? 6 : String(v).length) + '•••' : '');

  const typeBadgeClass = (type) => {
    switch (type) {
      case 'postgresql':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'zoho':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
      case 'salesforce':
        return 'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const typeAccentBar = (type) => {
    switch (type) {
      case 'postgresql':
        return 'bg-emerald-500';
      case 'zoho':
        return 'bg-amber-500';
      case 'salesforce':
        return 'bg-violet-500';
      default:
        return 'bg-blue-500';
    }
  };

  const renderConfigSummary = (item) => {
    const type = item?.connector_type;
    const cfg = item?.config || {};
    const cellClass = 'py-1.5 pr-4';
    if (type === 'postgresql') {
      return (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Host</dt><dd className="text-gray-900 dark:text-gray-100">{cfg.host}</dd></div>
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Port</dt><dd className="text-gray-900 dark:text-gray-100">{cfg.port}</dd></div>
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Database</dt><dd className="text-gray-900 dark:text-gray-100">{cfg.database}</dd></div>
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Username</dt><dd className="text-gray-900 dark:text-gray-100">{cfg.username}</dd></div>
          <div className={`${cellClass} col-span-2 sm:col-span-4`}><dt className="text-gray-500 dark:text-gray-400">Password</dt><dd className="text-gray-900 dark:text-gray-100">{mask(cfg.password)}</dd></div>
        </dl>
      );
    }
    if (type === 'zoho') {
      return (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Client ID</dt><dd className="text-gray-900 dark:text-gray-100">{cfg.client_id}</dd></div>
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Client Secret</dt><dd className="text-gray-900 dark:text-gray-100">{mask(cfg.client_secret)}</dd></div>
          <div className={`${cellClass} col-span-2 sm:col-span-4`}><dt className="text-gray-500 dark:text-gray-400">Refresh Token</dt><dd className="text-gray-900 dark:text-gray-100">{mask(cfg.refresh_token)}</dd></div>
        </dl>
      );
    }
    if (type === 'salesforce') {
      return (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">User Name</dt><dd className="text-gray-900 dark:text-gray-100">{cfg.user_name}</dd></div>
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Password</dt><dd className="text-gray-900 dark:text-gray-100">{mask(cfg.password)}</dd></div>
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Client ID</dt><dd className="text-gray-900 dark:text-gray-100">{cfg.client_id}</dd></div>
          <div className={cellClass}><dt className="text-gray-500 dark:text-gray-400">Client Secret</dt><dd className="text-gray-900 dark:text-gray-100">{mask(cfg.client_secret)}</dd></div>
        </dl>
      );
    }
    return <div className="text-sm text-gray-500">Unknown config</div>;
  };

  const typeIconBg = (type) => {
    switch (type) {
      case 'postgresql':
        return 'from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800';
      case 'zoho':
        return 'from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800';
      case 'salesforce':
        return 'from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-800';
      default:
        return 'from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900';
    }
  };

  const displayedIntegrations = useMemo(() => {
    let list = connectedIntegrations;
    if (filterType !== 'all') {
      list = list.filter((i) => i.connector_type === filterType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((i) => {
        const cfg = i?.config || {};
        const hay = [
          i?.connector_type,
          cfg?.host,
          cfg?.database,
          cfg?.username,
          cfg?.user_name,
          cfg?.client_id
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }
    const getWhen = (i) => i?.updated_at || i?.updatedAt || i?.modifiedAt || i?.created_at || i?.createdAt;
    if (sortBy === 'recent') {
      list = [...list].sort((a, b) => {
        const ad = getWhen(a) ? new Date(getWhen(a)).getTime() : 0;
        const bd = getWhen(b) ? new Date(getWhen(b)).getTime() : 0;
        return bd - ad;
      });
    } else if (sortBy === 'type-asc' || sortBy === 'type-desc') {
      list = [...list].sort((a, b) => {
        const av = a?.connector_type || '';
        const bv = b?.connector_type || '';
        return sortBy === 'type-asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return list;
  }, [connectedIntegrations, filterType, searchQuery, sortBy]);

  const countByType = (type) =>
    connectedIntegrations.filter((i) => i.connector_type === type).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your data connectors with a clean, professional interface</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleConnect} className="flex items-center space-x-2 shadow-md">
            <LinkIcon className="w-4 h-4" />
            <span>Add Integration</span>
          </Button>
        </div>
      </div>

      {/* List of Integrations */}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-gray-100 dark:ring-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Integrations</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {connectedIntegrations.length} total
            </span>
          </div>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex-1 min-w-[220px]">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by type, host, database..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarsArrowDownIcon className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                <option value="recent">Sort: Most Recent</option>
                <option value="type-asc">Sort: Type A-Z</option>
                <option value="type-desc">Sort: Type Z-A</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All', count: connectedIntegrations.length },
              { value: 'postgresql', label: 'PostgreSQL', count: countByType('postgresql') },
              { value: 'zoho', label: 'Zoho', count: countByType('zoho') },
              { value: 'salesforce', label: 'Salesforce', count: countByType('salesforce') },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value)}
                className={`text-xs px-3 py-1 rounded-full border transition ${
                  filterType === f.value
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-transparent'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {f.label} <span className="opacity-70">({f.count})</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="space-y-4">
              <LoadingSkeleton lines={1} />
              <LoadingSkeleton lines={1} />
              <LoadingSkeleton lines={1} />
            </div>
          ) : connectedIntegrations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 mb-3">
                <PuzzlePieceIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="font-medium">No integrations yet</p>
              <p className="text-sm">Click "Add Integration" to create your first connector</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayedIntegrations.map((integration) => (
              <div key={getId(integration)} className="relative border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-md hover:ring-1 hover:ring-gray-200 dark:hover:ring-gray-600 transition-all bg-white dark:bg-gray-800">
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${typeAccentBar(integration.connector_type)}`} />
                <div className="p-5 bg-gradient-to-br from-white via-slate-50 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 shrink-0 bg-gradient-to-br ${typeIconBg(integration.connector_type)} rounded-xl flex items-center justify-center ring-1 ring-white/60 dark:ring-black/30`}>
                      {integration.connector_type === 'postgresql' && <CircleStackIcon className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />}
                      {integration.connector_type === 'zoho' && <BuildingOffice2Icon className="w-6 h-6 text-amber-700 dark:text-amber-300" />}
                      {integration.connector_type === 'salesforce' && <CloudIcon className="w-6 h-6 text-violet-700 dark:text-violet-300" />}
                      {!['postgresql','zoho','salesforce'].includes(integration.connector_type) && <PuzzlePieceIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white capitalize truncate">{integration.connector_type}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeBadgeClass(integration.connector_type)}`}>{integration.connector_type}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Secure</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Configured {integration?.config ? Object.keys(integration.config).length : 0} fields</span>
                        {(() => {
                          const when = integration?.updated_at || integration?.updatedAt || integration?.modifiedAt || integration?.created_at || integration?.createdAt;
                          return when ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              Updated {formatDistanceToNow(new Date(when), { addSuffix: true })}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleConfigure(integration)} className="flex items-center space-x-2 shadow-sm">
                      <Cog6ToothIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(integration); setShowDeleteModal(true); }} className="flex items-center space-x-2 shadow-sm">
                      <TrashIcon className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Add Integration Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => {
          setShowConnectModal(false);
          setSelectedIntegration(null);
          resetVisibilityToggles();
        }}
        title={`Add Integration`}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
            <div className="w-10 h-10 bg-white/80 dark:bg-gray-800/60 rounded-lg flex items-center justify-center">
              <PuzzlePieceIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Create a new connector</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Choose a type and fill in the required credentials</div>
            </div>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target;
            const type = form.connector_type.value;
            let config = {};
            if (type === 'postgresql') {
              config = {
                host: form.host.value,
                port: parseInt(form.port.value, 10),
                database: form.database.value,
                username: form.username.value,
                password: form.password.value,
              };
            } else if (type === 'zoho') {
              config = {
                client_id: form.client_id.value,
                client_secret: form.client_secret.value,
                refresh_token: form.refresh_token.value,
              };
            } else if (type === 'salesforce') {
              config = {
                user_name: form.user_name.value,
                password: form.sf_password.value,
                client_id: form.sf_client_id.value,
                client_secret: form.sf_client_secret.value,
              };
            }
            await handleCreateIntegration(type, config);
            setSelectedIntegration(null);
          }} className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connector Type</label>
              <select name="connector_type" value={createType} onChange={(e) => setCreateType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CONNECTOR_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {createType === 'postgresql' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Host</label>
                  <input name="host" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  <p className="text-xs text-gray-500 mt-1">E.g. db.example.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port</label>
                  <input name="port" type="number" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  <p className="text-xs text-gray-500 mt-1">Default 5432</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Database</label>
                  <input name="database" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <input name="username" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                </div>
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input name="password" type={showPgPassword ? 'text' : 'password'} required className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  <button type="button" onClick={() => setShowPgPassword(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    {showPgPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Stored securely</p>
                </div>
              </div>
            )}

            {createType === 'zoho' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                  <input name="client_id" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
                  <input name="client_secret" type={showZohoClientSecret ? 'text' : 'password'} required className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  <button type="button" onClick={() => setShowZohoClientSecret(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    {showZohoClientSecret ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Refresh Token</label>
                  <input name="refresh_token" type={showZohoRefreshToken ? 'text' : 'password'} required className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  <button type="button" onClick={() => setShowZohoRefreshToken(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    {showZohoRefreshToken ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {createType === 'salesforce' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Name</label>
                  <input name="user_name" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input name="sf_password" type={showSfPassword ? 'text' : 'password'} required className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  <button type="button" onClick={() => setShowSfPassword(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    {showSfPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                  <input name="sf_client_id" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
                  <input name="sf_client_secret" type={showSfClientSecret ? 'text' : 'password'} required className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  <button type="button" onClick={() => setShowSfClientSecret(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    {showSfClientSecret ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
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

      {/* Edit Integration Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedIntegration(null);
          resetVisibilityToggles();
        }}
        title={`Edit ${selectedIntegration?.connector_type}`}
        size="md"
      >
        {selectedIntegration && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <PuzzlePieceIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white capitalize">{selectedIntegration.connector_type}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Edit configuration</p>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const type = selectedIntegration.connector_type;
              const form = e.target;
              let config = {};
              if (type === 'postgresql') {
                // Only include password if provided; keep others required
                const password = form.password.value;
                config = {
                  host: form.host.value,
                  port: parseInt(form.port.value, 10),
                  database: form.database.value,
                  username: form.username.value,
                };
                if (password) config.password = password;
              } else if (type === 'zoho') {
                // Sensitive fields optional: client_secret, refresh_token
                const client_secret = form.client_secret.value;
                const refresh_token = form.refresh_token.value;
                config = {
                  client_id: form.client_id.value,
                };
                if (client_secret) config.client_secret = client_secret;
                if (refresh_token) config.refresh_token = refresh_token;
              } else if (type === 'salesforce') {
                // Sensitive fields optional: password, client_secret
                const sf_password = form.sf_password.value;
                const sf_client_secret = form.sf_client_secret.value;
                config = {
                  user_name: form.user_name.value,
                  client_id: form.sf_client_id.value,
                };
                if (sf_password) config.password = sf_password;
                if (sf_client_secret) config.client_secret = sf_client_secret;
              }
              await handleUpdateIntegration(getId(selectedIntegration), { connector_type: type, config });
              setSelectedIntegration(null);
            }} className="space-y-4">
              {selectedIntegration.connector_type === 'postgresql' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Host</label>
                    <input name="host" defaultValue={selectedIntegration?.config?.host} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port</label>
                    <input name="port" type="number" defaultValue={selectedIntegration?.config?.port} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Database</label>
                    <input name="database" defaultValue={selectedIntegration?.config?.database} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input name="username" defaultValue={selectedIntegration?.config?.username} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input name="password" defaultValue={selectedIntegration?.config?.password || ''} type={showPgPassword ? 'text' : 'password'} placeholder="Leave blank to keep current" className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                    <button type="button" onClick={() => setShowPgPassword(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      {showPgPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep the existing password</p>
                  </div>
                </div>
              )}

              {selectedIntegration.connector_type === 'zoho' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                    <input name="client_id" defaultValue={selectedIntegration?.config?.client_id} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
                    <input name="client_secret" defaultValue={selectedIntegration?.config?.client_secret || ''} type={showZohoClientSecret ? 'text' : 'password'} placeholder="Leave blank to keep current" className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                    <button type="button" onClick={() => setShowZohoClientSecret(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      {showZohoClientSecret ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep the existing secret</p>
                  </div>
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Refresh Token</label>
                    <input name="refresh_token" defaultValue={selectedIntegration?.config?.refresh_token || ''} type={showZohoRefreshToken ? 'text' : 'password'} placeholder="Leave blank to keep current" className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                    <button type="button" onClick={() => setShowZohoRefreshToken(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      {showZohoRefreshToken ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep the existing token</p>
                  </div>
                </div>
              )}

              {selectedIntegration.connector_type === 'salesforce' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Name</label>
                    <input name="user_name" defaultValue={selectedIntegration?.config?.user_name} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input name="sf_password" defaultValue={selectedIntegration?.config?.password || ''} type={showSfPassword ? 'text' : 'password'} placeholder="Leave blank to keep current" className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                    <button type="button" onClick={() => setShowSfPassword(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      {showSfPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep the existing password</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                    <input name="sf_client_id" defaultValue={selectedIntegration?.config?.client_id} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
                    <input name="sf_client_secret" defaultValue={selectedIntegration?.config?.client_secret || ''} type={showSfClientSecret ? 'text' : 'password'} placeholder="Leave blank to keep current" className="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                    <button type="button" onClick={() => setShowSfClientSecret(v => !v)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      {showSfClientSecret ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep the existing secret</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedIntegration(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>Save Changes</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
        title="Delete Integration"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300">
              This action will permanently remove the integration
              {deleteTarget ? ` “${deleteTarget.connector_type}”` : ''}. This cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}>Cancel</Button>
            <Button variant="danger" loading={loading} onClick={async () => {
              if (!deleteTarget) return;
              await handleDeleteIntegration(getId(deleteTarget));
              setShowDeleteModal(false);
              setDeleteTarget(null);
            }}>Delete</Button>
          </div>
        </div>
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