import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { PencilIcon, EyeIcon, EyeSlashIcon, DocumentIcon } from '@heroicons/react/24/solid';
import clientService from '../services/clientService';

const defaultProfile = {
  logo: null, // File object or null
  logoPreviewUrl: null, // for preview only
  name: 'John Doe',
  email: 'johndoe@example.com',
  phone: '+1 234 567 890',
  address: '123 Main Street, City, Country',
  documents: [
    // { id, name, file: File, previewUrl: string }
  ],
  connector: {
    type: 'PostgreSQL',
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'password',
    dbName: 'mydb',
    clientId: '',
    clientSecret: '',
    refreshToken: '',
  },
};

export const ProfileSettings = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [originalProfile, setOriginalProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);

  const handleDocumentPreview = (doc) => {
    setPreviewDocument(doc);
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  const getFileType = (filename) => {
    if (!filename) return 'unknown';
    const extension = filename.toLowerCase().split('.').pop();
    
    if (extension === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) return 'image';
    if (['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(extension)) return 'text';
    if (['doc', 'docx'].includes(extension)) return 'document';
    if (['xls', 'xlsx'].includes(extension)) return 'spreadsheet';
    if (['ppt', 'pptx'].includes(extension)) return 'presentation';
    
    return 'unknown';
  };

  useEffect(() => {
    // Try to get clientId from localStorage, fallback to extracting from clientDetails
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
      const clientDetails = localStorage.getItem('clientDetails');
      if (clientDetails) {
        try {
          const parsed = JSON.parse(clientDetails);
          clientId = parsed && parsed.data && parsed.data.client && parsed.data.client.id;
          console.log('Extracted clientId from clientDetails:', clientId);
        } catch (e) {
          console.error('Error parsing clientDetails from localStorage:', e);
        }
      }
    } else {
      console.log('Read clientId from localStorage:', clientId);
    }
    if (clientId) {
      clientService.getClientById(clientId)
        .then((data) => {
          console.log('Fetched client data by ID:', data);
          if (data && Array.isArray(data.data) && data.data.length > 0) {
            const d = data.data[0];
            // Normalize connector type for UI
            let connectorType = '';
            if (d.connector_type) {
              if (d.connector_type.toLowerCase() === 'postgresql') connectorType = 'PostgreSQL';
              else if (d.connector_type.toLowerCase() === 'zoho') connectorType = 'Zoho';
              else connectorType = d.connector_type;
            }
            // Fill Zoho config fields if type is Zoho, support both camelCase and snake_case
            let clientId = '', clientSecret = '', refreshToken = '';
            if (connectorType === 'Zoho' && d.config) {
              clientId = d.config.clientId || d.config.client_id || '';
              clientSecret = d.config.clientSecret || d.config.client_secret || '';
              refreshToken = d.config.refreshToken || d.config.refresh_token || '';
            }
            const loadedProfile = {
              logo: d.logo || null,
              name: d.full_name || '',
              email: d.email || '',
              phone: d.phone || '',
              address: d.address || '',
              notes: d.notes || '',
              status: d.status || '',
              documents: Array.isArray(d.client_documents)
                ? d.client_documents.map((url, idx) => ({ id: idx + 1, name: url.split('/').pop(), fileUrl: url }))
                : [],
              connector: {
                type: connectorType,
                host: d.config?.host || '',
                port: d.config?.port || (connectorType === 'PostgreSQL' ? 5432 : ''), // Default PostgreSQL port as number
                user: d.config?.username || '',
                password: d.config?.password || '',
                dbName: d.config?.database || '',
                clientId,
                clientSecret,
                refreshToken,
              },
            };
            console.log('Loaded PostgreSQL config:', {
              host: d.config?.host,
              port: d.config?.port,
              user: d.config?.username,
              database: d.config?.database
            });
            console.log('Loaded Zoho config:', { clientId, clientSecret, refreshToken }, 'Full connector:', loadedProfile.connector);
            setProfile(loadedProfile);
            setOriginalProfile(loadedProfile);
          }
        })
        .catch((err) => {
          setToast({ show: true, type: 'error', message: 'Failed to fetch client details.' });
        });
    }
  }, []);

  const showToast = (type, message) => setToast({ show: true, type, message });

  const handleAction = (action) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('success', `${action} successfully!`);
    }, 800);
  };

  const handleInputChange = (field, value) => setProfile({ ...profile, [field]: value });

  const handleConnectorChange = (field, value) =>
    setProfile({ ...profile, connector: { ...profile.connector, [field]: value } });

  const handleLogoUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setProfile({
      ...profile,
      logo: file,
      logoPreviewUrl: URL.createObjectURL(file),
    });
  };

  const handleDocumentUpload = (e) => {
    if (!e.target.files) return;
    const newDocs = Array.from(e.target.files).map((file) => ({
      id: Date.now() + '-' + file.name,
      name: file.name,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setProfile({ ...profile, documents: [...profile.documents, ...newDocs] });
  };

  const removeDocument = (id) =>
    setProfile({ ...profile, documents: profile.documents.filter((d) => d.id !== id) });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Get clientId from localStorage (or fallback)
      let clientId = localStorage.getItem('clientId');
      if (!clientId) {
        const clientDetails = localStorage.getItem('clientDetails');
        if (clientDetails) {
          try {
            const parsed = JSON.parse(clientDetails);
            clientId = parsed && parsed.data && parsed.data.client && parsed.data.client.id;
          } catch (e) {}
        }
      }
      if (!clientId) throw new Error('No client ID found');

        // Always send original values for url and client_ref
      const formData = new FormData();
      formData.append('full_name', profile.name);
      formData.append('address', profile.address);
        formData.append('url', originalProfile.url);
      formData.append('email', profile.email ?? '');
      formData.append('phone', profile.phone ?? '');
      formData.append('notes', profile.notes ?? '');
        formData.append('client_ref', originalProfile.client_ref);
      formData.append('status', profile.status ?? '');
      formData.append('connector_type', profile.connector.type ?? '');
      // Logo upload
      if (profile.logo instanceof File) {
        formData.append('logo', profile.logo);
      }
      // Config as JSON string
      formData.append('config', JSON.stringify({
        host: profile.connector.host ?? '',
        port: profile.connector.port ?? (profile.connector.type === 'PostgreSQL' ? 5432 : ''),
        database: profile.connector.dbName ?? '',
        username: profile.connector.user ?? '',
        password: profile.connector.password ?? '',
        // Zoho specific fields
        clientId: profile.connector.clientId ?? '',
        clientSecret: profile.connector.clientSecret ?? '',
        refreshToken: profile.connector.refreshToken ?? '',
      }));
      // Documents (if any)
      if (Array.isArray(profile.documents)) {
        profile.documents.forEach((doc) => {
          if (doc.file instanceof File) {
            formData.append('documents', doc.file, doc.name);
          }
        });
      }

      await clientService.updateClient(clientId, formData);
      setIsEditing(false);
      setLoading(false);
      setToast({ show: true, type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setLoading(false);
      setToast({ show: true, type: 'error', message: 'Failed to update profile.' });
      console.error('Profile update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Enhanced Header with Gradient */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
              Account Profile
            </h1>
            
            {/* Warm Greeting Message */}
            <div className="max-w-xl mx-auto">
              <p className="text-blue-100 text-lg font-medium leading-relaxed">
                {profile.name ? `Welcome back, ${profile.name.split(' ')[0]}!` : 'Welcome back!'} 
                <span className="block mt-2 text-white/95 font-semibold">
                  Ready to keep your profile sharp and perfectly connected?
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-400/15 rounded-full blur-xl"></div>
      </div>

      {/* Main Content with Enhanced Styling */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-12 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Dashboard</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-blue-600 font-medium">Profile Settings</span>
          </nav>
        </div>
        
        {/* Enhanced Profile Header Card */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 mb-16 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
              {/* Enhanced Profile Image */}
              <div className="relative group">
                {profile.logo ? (
                  <img
                    className="h-36 w-36 rounded-3xl object-cover border-4 border-white shadow-2xl group-hover:shadow-3xl transition-all duration-300"
                    src={profile.logo}
                    alt="Profile"
                  />
                ) : (
                  <div className="h-36 w-36 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-white shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                    <svg className="h-20 w-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                {isEditing && (
                  <label
                    htmlFor="logoUpload"
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600/90 to-purple-600/90 rounded-3xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <svg className="h-8 w-8 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs text-white font-medium">Change Photo</span>
                    </div>
                  </label>
                )}
                <input id="logoUpload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </div>
              
              {/* Enhanced Profile Info */}
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  {profile.name || 'No Name'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-xl mb-4 font-medium">
                  {profile.email || 'No Email'}
                </p>
                
                {/* Enhanced Status and Stats */}
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start mb-6">
                  {profile.status && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                      {profile.status}
                    </span>
                  )}
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Member since 2024
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center sm:text-left">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <span className="font-bold text-2xl text-blue-600">{profile.documents.length}</span>
                        <span className="block text-sm text-gray-500">Documents</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      <div>
                        <span className="font-bold text-2xl text-purple-600">{profile.connector.type}</span>
                        <span className="block text-sm text-gray-500">Integration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Premium Personal Details Card */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-0 overflow-hidden">
            {/* Elegant Header with Subtle Pattern */}
            <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-8 border-b border-gray-100 dark:border-gray-700">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/40 to-blue-100/40 rounded-full blur-xl"></div>
              
              <div className="relative flex items-center space-x-4">
                {/* Professional Icon Container */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Manage your profile details and contact information
                  </p>
                </div>
                
                {/* Status Indicator */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-xs text-gray-500 mt-1">Active</span>
                </div>
              </div>
            </div>

            {/* Enhanced Form Content */}
            <div className="p-8">
              <div className="space-y-7">
                {['name', 'email', 'phone', 'address', 'notes'].map((field, index) => (
                  <div key={field} className="group/field">
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-wide uppercase text-xs">
                      {field}
                      {(field === 'name' || field === 'email') && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field === 'notes' ? (
                      <div className="relative">
                        <textarea
                          value={profile[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          disabled={!isEditing}
                          rows={4}
                          className={`block w-full rounded-2xl border-0 shadow-lg ring-1 ring-inset transition-all duration-300 ${
                            isEditing
                              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-blue-500 focus:shadow-2xl transform focus:scale-[1.01]'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed ring-gray-100 dark:ring-gray-700'
                          } py-4 px-5 text-sm font-medium placeholder:text-gray-400 resize-none`}
                          placeholder={`Enter your ${field}...`}
                        />
                        {/* Character count for notes */}
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                          {(profile[field] || '').length}/500
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                          value={profile[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          disabled={!isEditing}
                          className={`block w-full rounded-2xl border-0 shadow-lg ring-1 ring-inset transition-all duration-300 ${
                            isEditing
                              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-blue-500 focus:shadow-2xl transform focus:scale-[1.01]'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed ring-gray-100 dark:ring-gray-700'
                          } py-4 px-5 text-sm font-medium placeholder:text-gray-400`}
                          placeholder={`Enter your ${field}...`}
                        />
                        {/* Field Icons */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          {field === 'email' && (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          )}
                          {field === 'phone' && (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          )}
                          {field === 'address' && (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Professional Footer */}
            <div className="px-8 pb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
              <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>Profile Completion</span>
                <span className="font-semibold">
                  {Math.round(Object.values(profile).filter(v => v && v !== '').length / Object.keys(profile).length * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Premium Database Connector Card */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-0 overflow-hidden">
            {/* Sophisticated Header */}
            <div className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-8 border-b border-gray-100 dark:border-gray-700">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-indigo-100/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-100/40 to-purple-100/40 rounded-full blur-xl"></div>
              
              <div className="relative flex items-center space-x-4">
                {/* Database Icon Container */}
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Database Integration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Configure secure database connection settings
                  </p>
                </div>
                
                {/* Connection Status */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full shadow-lg ${profile.connector.host ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                  <span className="text-xs text-gray-500 mt-1">
                    {profile.connector.host ? 'Connected' : 'Setup'}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Configuration Content */}
            <div className="p-8">
              <div className="space-y-7">
                {/* Connector Type Selection */}
                <div className="group/field">
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-wide uppercase text-xs">
                    Integration Type
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={profile.connector.type}
                      onChange={(e) => handleConnectorChange('type', e.target.value)}
                      disabled={!isEditing}
                      className={`block w-full rounded-2xl border-0 shadow-lg ring-1 ring-inset transition-all duration-300 ${
                        isEditing
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-purple-500 focus:shadow-2xl transform focus:scale-[1.01]'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed ring-gray-100 dark:ring-gray-700'
                      } py-4 px-5 text-sm font-medium appearance-none`}
                    >
                      <option value="PostgreSQL">PostgreSQL Database</option>
                      <option value="Zoho">Zoho CRM Integration</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Enhanced PostgreSQL Fields - Always Show Configuration */}
                {profile.connector.type === 'PostgreSQL' && (
                  <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200">Database Configuration</h4>
                    </div>
                    
                    {[
                      { key: 'host', label: 'Database Host', placeholder: 'e.g., localhost or db.company.com', icon: 'server' },
                      { key: 'port', label: 'Port Number', placeholder: 'e.g., 5432', icon: 'port' },
                      { key: 'user', label: 'Username', placeholder: 'Database username', icon: 'user' },
                      { key: 'password', label: 'Password', placeholder: 'Database password', icon: 'key' },
                      { key: 'dbName', label: 'Database Name', placeholder: 'Your database name', icon: 'database' },
                    ].map(({ key, label, placeholder, icon }) => (
                      <div key={key} className="group/field">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
                          {label} {(key === 'host' || key === 'dbName') && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                          <input
                            type={
                              key === 'port'
                                ? 'number'
                                : key === 'password'
                                ? showPassword
                                  ? 'text'
                                  : 'password'
                                : 'text'
                            }
                            value={profile.connector[key] || ''}
                            onChange={(e) =>
                              handleConnectorChange(key, key === 'port' ? (parseInt(e.target.value) || e.target.value) : e.target.value)
                            }
                            disabled={!isEditing}
                            placeholder={placeholder}
                            className={`block w-full rounded-xl border-0 shadow-md ring-1 ring-inset transition-all duration-300 ${
                              isEditing
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-blue-500 focus:shadow-lg transform focus:scale-[1.01]'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed ring-gray-100 dark:ring-gray-700'
                            } py-3 px-4 ${key === 'password' ? 'pr-12' : ''} text-sm font-medium placeholder:text-gray-400`}
                          />
                          {key === 'password' && (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-xl transition-colors"
                            >
                              {showPassword ? (
                                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                        {/* Show current value when not editing */}
                        {!isEditing && profile.connector[key] && (
                          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Current: {key === 'password' ? '••••••••' : profile.connector[key]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Enhanced Zoho Fields - Always Show Configuration */}
                {profile.connector.type === 'Zoho' && (
                  <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl border border-purple-100/50 dark:border-purple-800/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-purple-800 dark:text-purple-200">Zoho API Configuration</h4>
                    </div>
                    
                    {[
                      { key: 'clientId', label: 'Client ID', placeholder: 'Your Zoho app client ID' },
                      { key: 'clientSecret', label: 'Client Secret', placeholder: 'Your Zoho app client secret' },
                      { key: 'refreshToken', label: 'Refresh Token', placeholder: 'Your Zoho refresh token' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="group/field">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
                          {label} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={profile.connector[key] || ''}
                          onChange={(e) => handleConnectorChange(key, e.target.value)}
                          disabled={!isEditing}
                          placeholder={placeholder}
                          className={`block w-full rounded-xl border-0 shadow-md ring-1 ring-inset transition-all duration-300 ${
                            isEditing
                              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-purple-500 focus:shadow-lg transform focus:scale-[1.01]'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed ring-gray-100 dark:ring-gray-700'
                          } py-3 px-4 text-sm font-medium placeholder:text-gray-400`}
                        />
                        {/* Show current value when not editing */}
                        {!isEditing && profile.connector[key] && (
                          <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
                            Current: {key === 'clientSecret' ? '••••••••' : (profile.connector[key].length > 20 ? profile.connector[key].substring(0, 20) + '...' : profile.connector[key])}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Professional Footer */}
            <div className="px-8 pb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
              <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>Configuration Status</span>
                <span className="font-semibold">
                  {profile.connector.type === 'PostgreSQL' 
                    ? (profile.connector.host && profile.connector.dbName ? 'Complete' : 'Incomplete')
                    : (profile.connector.clientId && profile.connector.clientSecret ? 'Complete' : 'Incomplete')
                  }
                </span>
              </div>
            </div>
          </div>
        </div>        {/* Enhanced Documents Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 mt-12 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Document Management
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload and manage your documents securely
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{profile.documents.length}</div>
                <div className="text-xs text-gray-500">Documents</div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {profile.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{doc.name}</span>
                      <div className="text-xs text-gray-500">Document file</div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDocumentPreview(doc)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                      className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300"
                    >
                      Download
                    </button>
                    {isEditing && (
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing && (
                <div className="border-2 border-dashed border-blue-300 dark:border-blue-500 rounded-xl p-6 text-center bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-all duration-300">
                  <svg className="mx-auto h-12 w-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <input
                    type="file"
                    multiple
                    onChange={handleDocumentUpload}
                    className="block w-full text-sm text-gray-600 dark:text-gray-400
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white
                      hover:file:from-blue-600 hover:file:to-purple-600
                      file:shadow-lg file:transition-all file:duration-300"
                  />
                  <p className="mt-2 text-sm text-gray-500">Drag and drop files here, or click to browse</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex justify-center mt-16">
          <div className="relative">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-lg">Edit Profile</span>
                </div>
                {/* Animated background */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300"></div>
                </div>
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className="text-lg">{loading ? 'Saving...' : 'Save Changes'}</span>
                </div>
                {/* Animated background */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300"></div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {previewDocument.name}
                  </h3>
                  <p className="text-sm text-gray-500">Document Preview</p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 h-96 overflow-auto">
              {previewDocument.fileUrl && (
                <div className="w-full h-full">
                  {(() => {
                    const fileType = getFileType(previewDocument.name);
                    console.log('File type detected:', fileType, 'for file:', previewDocument.name);
                    
                    switch (fileType) {
                      case 'pdf':
                        return (
                          <div className="w-full h-full">
                            <iframe
                              src={previewDocument.fileUrl}
                              className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg"
                              title={previewDocument.name}
                              onError={() => console.log('PDF iframe failed to load')}
                            />
                            {/* Fallback link if iframe fails */}
                            <div className="mt-4 text-center">
                              <a 
                                href={previewDocument.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Open PDF in new tab if preview doesn't load
                              </a>
                            </div>
                          </div>
                        );
                      
                      case 'image':
                        return (
                          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <img
                              src={previewDocument.fileUrl}
                              alt={previewDocument.name}
                              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                              onError={(e) => {
                                console.log('Image failed to load');
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div style={{display: 'none'}} className="text-center">
                              <p className="text-gray-500 mb-4">Image could not be loaded</p>
                              <a 
                                href={previewDocument.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Open Image
                              </a>
                            </div>
                          </div>
                        );
                      
                      case 'text':
                        return (
                          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg h-full">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                              Text file preview:
                            </p>
                            <iframe
                              src={previewDocument.fileUrl}
                              className="w-full h-4/5 border border-gray-200 dark:border-gray-700 rounded bg-white"
                              title={previewDocument.name}
                            />
                          </div>
                        );
                      
                      case 'document':
                        return (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                              Word Document
                            </h4>
                            <p className="text-gray-500 mb-4">
                              Microsoft Word documents cannot be previewed directly. Download to view.
                            </p>
                            <button
                              onClick={() => window.open(previewDocument.fileUrl, '_blank')}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Download & Open
                            </button>
                          </div>
                        );
                      
                      default:
                        // Try to preview as generic document first
                        return (
                          <div className="w-full h-full">
                            <iframe
                              src={previewDocument.fileUrl}
                              className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg"
                              title={previewDocument.name}
                              onLoad={() => console.log('Generic iframe loaded successfully')}
                              onError={() => console.log('Generic iframe failed, showing fallback')}
                            />
                            {/* Enhanced fallback */}
                            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                              <div className="flex items-start space-x-3">
                                <svg className="w-6 h-6 text-yellow-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                  <h5 className="font-medium text-yellow-800 dark:text-yellow-200">
                                    Preview Limitation
                                  </h5>
                                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    This file type ({getFileType(previewDocument.name)}) may not preview correctly in the browser. 
                                    Try downloading the file to view it properly.
                                  </p>
                                  <button
                                    onClick={() => window.open(previewDocument.fileUrl, '_blank')}
                                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                                  >
                                    Download File
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                    }
                  })()}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="text-sm text-gray-500">
                File: {previewDocument.name}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.open(previewDocument.fileUrl, '_blank')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Download
                </button>
                <button
                  onClick={closePreview}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default ProfileSettings;
