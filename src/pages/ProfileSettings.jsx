import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { PencilIcon, EyeIcon, EyeSlashIcon, DocumentIcon } from '@heroicons/react/24/solid';

const defaultProfile = {
  logo: null,
  name: 'John Doe',
  email: 'johndoe@example.com',
  phone: '+1 234 567 890',
  address: '123 Main Street, City, Country',
  documents: [
    { id: 1, name: 'Resume.pdf', fileUrl: '' },
    { id: 2, name: 'ID Card.pdf', fileUrl: '' },
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
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

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
    setProfile({ ...profile, logo: URL.createObjectURL(e.target.files[0]) });
  };

  const handleDocumentUpload = (e) => {
    if (!e.target.files) return;
    const newDocs = Array.from(e.target.files).map((file) => ({
      id: Date.now() + '-' + file.name,
      name: file.name,
      fileUrl: URL.createObjectURL(file),
    }));
    setProfile({ ...profile, documents: [...profile.documents, ...newDocs] });
  };

  const removeDocument = (id) =>
    setProfile({ ...profile, documents: profile.documents.filter((d) => d.id !== id) });

  const handleSave = () => {
    setIsEditing(false);
    handleAction('Profile updated');
  };

  return (
    <div className="relative p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Subtle Floating Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Header */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 animate-gradient-x">
          Profile Settings
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg">
          Manage your account and connector settings.
        </p>
      </div>

      {/* Logo */}
      <div className="relative flex justify-center mt-6 z-10">
        {profile.logo ? (
          <img
            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl transform transition-transform duration-500 hover:scale-105"
            src={profile.logo}
            alt="Profile Logo"
          />
        ) : (
          <div className="h-32 w-32 rounded-full bg-blue-400 flex items-center justify-center border-4 border-white shadow-xl text-white text-lg font-bold transform transition-transform duration-500 hover:scale-105">
            Logo
          </div>
        )}
        {isEditing && (
          <label
            htmlFor="logoUpload"
            className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-gray-700/30 rounded-full cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/50 transition"
          >
            <PencilIcon className="h-8 w-8 text-gray-700 dark:text-white" />
          </label>
        )}
        <input id="logoUpload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 relative z-10">
        {/* Personal Details Card */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-500 border-l-4 border-blue-500">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-600">
              Personal Details
            </h2>
            {['name', 'email', 'phone', 'address'].map((field) => (
              <div key={field} className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={profile[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  disabled={!isEditing}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    isEditing
                      ? 'bg-white/80 dark:bg-gray-700/70 text-gray-900 dark:text-white transition-all duration-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-6 p-4 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl text-center text-gray-700 dark:text-gray-300 text-sm font-medium flex flex-col gap-1">
            <span>Total Documents: {profile.documents.length}</span>
            <span>Connector: {profile.connector.type}</span>
          </div>
        </div>

        {/* Documents & Connector Card */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col space-y-6 hover:shadow-2xl transition-shadow duration-500 border-l-4 border-blue-500">
          {/* Documents */}
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-bold text-blue-600 mt-2">
              Your Documents
            </h2>
            {profile.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between items-center bg-white/70 dark:bg-gray-700/50 p-3 rounded-xl border hover:shadow-md transform transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2">
                  <DocumentIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                  <span className="font-medium">{doc.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open(doc.fileUrl, '_blank')}>
                    View
                  </Button>
                  {isEditing && (
                    <Button size="sm" variant="danger" onClick={() => removeDocument(doc.id)}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isEditing && (
              <input
                type="file"
                multiple
                onChange={handleDocumentUpload}
                className="mt-2 text-sm text-gray-600 dark:text-gray-300"
              />
            )}
          </div>

          {/* Connector */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-blue-600 mt-2">
              Connector Setup
            </h2>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Connector Type</label>
            <select
              value={profile.connector.type}
              onChange={(e) => handleConnectorChange('type', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                isEditing
                  ? 'bg-white/80 dark:bg-gray-700/70 text-gray-900 dark:text-white transition-all duration-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="Zoho">Zoho</option>
            </select>

            {/* PostgreSQL Fields */}
            {profile.connector.type === 'PostgreSQL' &&
              [
                { key: 'host', label: 'Host' },
                { key: 'port', label: 'Port' },
                { key: 'user', label: 'User' },
                { key: 'password', label: 'Password' },
                { key: 'dbName', label: 'Database Name' },
              ].map(({ key, label }) => (
                <div key={key} className="relative flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
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
                    value={profile.connector[key]}
                    onChange={(e) =>
                      handleConnectorChange(key, key === 'port' ? parseInt(e.target.value) : e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder={label}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isEditing
                        ? 'bg-white/80 dark:bg-gray-700/70 text-gray-900 dark:text-white transition-all duration-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  />
                  {key === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8 flex items-center text-gray-500 dark:text-gray-300 transform transition-transform duration-300 hover:rotate-12"
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              ))}

            {/* Zoho Fields */}
            {profile.connector.type === 'Zoho' &&
              [
                { key: 'clientId', label: 'Client ID' },
                { key: 'clientSecret', label: 'Client Secret' },
                { key: 'refreshToken', label: 'Refresh Token' },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                  <input
                    type="text"
                    value={profile.connector[key]}
                    onChange={(e) => handleConnectorChange(key, e.target.value)}
                    disabled={!isEditing}
                    placeholder={label}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isEditing
                        ? 'bg-white/80 dark:bg-gray-700/70 text-gray-900 dark:text-white transition-all duration-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Edit / Save Buttons */}
      <div className="flex justify-center mt-8 relative z-10">
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
        {isEditing && (
          <Button variant="primary" onClick={handleSave} loading={loading}>
            Save Profile
          </Button>
        )}
      </div>

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
