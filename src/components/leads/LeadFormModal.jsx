import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ChartBarIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export const LeadFormModal = ({
  isOpen,
  onClose,
  title,
  formData,
  onFormDataChange,
  onSubmit,
  loading,
  isEditMode = false
}) => {
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  
  // Refs for click outside detection
  const sourceDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(event.target)) {
        setSourceDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sourceOptions = [
    { value: 'website', label: '🌐 Website', description: 'Online presence' },
    { value: 'social-media', label: '📱 Social Media', description: 'Social platforms' },
    { value: 'referral', label: '👥 Referral', description: 'Word of mouth' },
    { value: 'email-campaign', label: '📧 Email Campaign', description: 'Email marketing' },
    { value: 'advertisement', label: '📢 Advertisement', description: 'Paid advertising' },
    { value: 'other', label: '🔄 Other Sources', description: 'Alternative channels' }
  ];

  const statusOptions = [
    { value: 'new', label: '🔵 New Lead', description: 'Just entered system' },
    { value: 'in-progress', label: '🟡 In Progress', description: 'Being contacted' },
    { value: 'qualified', label: '🟢 Qualified', description: 'Meets criteria' },
    { value: 'converted', label: '🟣 Converted', description: 'Deal closed' },
    { value: 'closed', label: '⚫ Closed', description: 'No longer active' }
  ];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'qualified': return 'text-green-600 bg-green-50 border-green-200';
      case 'converted': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      <style jsx>{`
        .dropdown-rounded option {
          border-radius: 12px !important;
          margin: 4px !important;
          padding: 12px 16px !important;
          background-color: white !important;
          color: #374151 !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }
        
        .dropdown-rounded option:hover {
          background-color: #f3f4f6 !important;
          transform: translateX(4px) !important;
        }
        
        .dropdown-rounded option:checked,
        .dropdown-rounded option:selected {
          background-color: #3b82f6 !important;
          color: white !important;
          border-radius: 12px !important;
        }
        
        select.dropdown-rounded {
          border-radius: 1.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        select.dropdown-rounded:focus {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isEditMode ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            }`}>
              {isEditMode ? (
                <UserIcon className="w-5 h-5" />
              ) : (
                <CheckCircleIcon className="w-5 h-5" />
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode 
                ? 'Update lead information and track progress' 
                : 'Create a new lead and start building relationships'
              }
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* Personal Information Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Personal Information
            </h4>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Enter full name"
                />
                <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Enter email address"
                />
                <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Enter phone number"
                />
                <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Source Section (Create Mode Only) */}
        {!isEditMode && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                Lead Source
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-5">
                Select how this lead discovered your business
              </p>
            </div>
            
            <div>
              <label htmlFor="source" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ml-1">
                Source Channel
              </label>
              <div ref={sourceDropdownRef} className="relative group">
                <div
                  onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}
                  className="block w-full px-6 py-5 text-base font-medium rounded-3xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-inner focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all duration-300 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg cursor-pointer pr-16 backdrop-blur-sm"
                >
                  {sourceOptions.find(opt => opt.value === formData.source)?.label || '🌐 Website'}
                </div>
                
                {sourceDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-600 shadow-2xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-3">
                      {sourceOptions.map((option, index) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            onFormDataChange(prev => ({ ...prev, source: option.value }));
                            setSourceDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 border-2 border-transparent hover:shadow-lg hover:scale-[1.02] ${
                            formData.source === option.value ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          style={{
                            animationDelay: `${index * 50}ms`
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <span className="text-xl">{option.label.split(' ')[0]}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {option.label.substring(2)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          {formData.source === option.value && (
                            <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border border-blue-200 dark:border-blue-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                    <ChevronDownIcon className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${sourceDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lead Status Section */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full mr-3"></div>
              Lead Status
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-5">
              Set the current progress stage for this lead
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ml-1">
                Current Status
              </label>
              <div ref={statusDropdownRef} className="relative group">
                <div
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="block w-full px-6 py-5 text-base font-medium rounded-3xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-inner focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/20 transition-all duration-300 ease-out hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg cursor-pointer pr-16 backdrop-blur-sm"
                >
                  {statusOptions.find(opt => opt.value === formData.status)?.label || '🔵 New Lead'}
                </div>
                
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-600 shadow-2xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-3">
                      {statusOptions.map((option, index) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            onFormDataChange(prev => ({ ...prev, status: option.value }));
                            setStatusDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 border-2 border-transparent hover:shadow-lg hover:scale-[1.02] ${
                            formData.status === option.value ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          style={{
                            animationDelay: `${index * 50}ms`
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <span className="text-xl">{option.label.split(' ')[0]}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {option.label.substring(2)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          {formData.status === option.value && (
                            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 border border-green-200 dark:border-green-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                    <ChevronDownIcon className={`w-5 h-5 text-green-600 dark:text-green-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quality Score Display */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Quality Score: {
                      formData.status === 'new' ? '20% (Cold)' :
                      formData.status === 'in-progress' ? '50% (Warm)' :
                      formData.status === 'qualified' ? '70% (Good)' :
                      formData.status === 'converted' ? '90% (Hot)' :
                      formData.status === 'closed' ? '100% (Client)' : '0%'
                    }
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Automatically calculated based on status
                  </p>
                </div>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 ease-out rounded-full ${
                      formData.status === 'new' ? 'bg-red-500 w-1/5' :
                      formData.status === 'in-progress' ? 'bg-orange-500 w-2/4' :
                      formData.status === 'qualified' ? 'bg-yellow-500 w-3/5' :
                      formData.status === 'converted' ? 'bg-green-500 w-11/12' :
                      formData.status === 'closed' ? 'bg-blue-500 w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section (Create Mode Only) */}
        {!isEditMode && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="mb-4">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Additional Notes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add any relevant information about this lead
              </p>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes & Comments
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="block w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter any additional notes about this lead..."
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Include interests, preferences, or special requirements
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-8 border-t-2 border-gray-100 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="px-8 py-3 text-sm font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="group relative px-8 py-3 text-sm font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl border-0 overflow-hidden"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            
            <div className="relative flex items-center justify-center space-x-2">
              {isEditMode ? (
                <>
                  <UserIcon className="w-5 h-5" />
                  <span>Update Lead</span>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-3 h-3 text-white" />
                    </div>
                    <span>Create New Lead</span>
                  </div>
                  <div className="ml-2 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
                    <span className="text-xs">✨</span>
                  </div>
                </>
              )}
            </div>
          </Button>
        </div>
      </form>
    </Modal>
    </>
  );
};