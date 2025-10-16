import React, { useState, useEffect } from 'react';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { leadService } from '../services/leadService';
import { saveAs } from 'file-saver';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { ConfirmationModal } from '../components/leads/ConfirmationModal';

export const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website',
    notes: '',
    status: 'new',
    score: 0
  });

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setPageLoading(true);
      const response = await leadService.getAllLeads();
      
      // Transform API data to match expected format
      const transformedLeads = Array.isArray(response) ? response.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status || 'new',
        source: lead.source || 'Unknown',
        notes: lead.notes || '',
        created: lead.created_at ? new Date(lead.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        score: Math.floor(Math.random() * 100) + 1 // Placeholder since API doesn't provide score
      })) : [];
      
      setLeads(transformedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      let errorMessage = 'Failed to fetch leads. ';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage += 'Network Error: Please check if your backend server is running on localhost:5600';
      } else if (error.response?.status === 401) {
        errorMessage += 'Authentication failed. Please login again.';
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      showToast('error', errorMessage);
    } finally {
      setPageLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      source: 'website',
      notes: '',
      status: 'new',
      score: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status || 'new'
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (lead) => {
    setDeletingLead(lead);
    setShowDeleteModal(true);
  };

  const handleCreateLead = async () => {
    try {
      setLoading(true);
      console.log('📝 Creating lead with form data:', formData);
      
      const response = await leadService.createLead(formData);
      console.log('✅ Lead creation response:', response);
      
      // Refresh leads to get the latest data
      await fetchLeads();
      
      setShowNewLeadModal(false);
      resetForm();
      showToast('success', 'New lead added successfully!');
    } catch (error) {
      console.error('Error creating lead:', error);
      showToast('error', 'Failed to create lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLead = async () => {
    try {
      setLoading(true);
      console.log('📝 Updating lead:', editingLead.id, 'with data:', formData);
      
      const response = await leadService.updateLead(editingLead.id, formData);
      console.log('✅ Lead update response:', response);
      
      // Refresh leads to get the latest data
      await fetchLeads();
      
      setShowEditModal(false);
      setEditingLead(null);
      resetForm();
      showToast('success', 'Lead updated successfully!');
    } catch (error) {
      console.error('Error updating lead:', error);
      showToast('error', 'Failed to update lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    try {
      setLoading(true);
      console.log('🗑️ Deleting lead:', deletingLead.id);
      
      await leadService.deleteLead(deletingLead.id);
      console.log('✅ Lead deleted successfully');
      
      // Remove from local state and refresh
      setLeads(prev => prev.filter(lead => lead.id !== deletingLead.id));
      setSelectedLeads(prev => prev.filter(id => id !== deletingLead.id));
      
      setShowDeleteModal(false);
      setDeletingLead(null);
      showToast('success', 'Lead deleted successfully!');
    } catch (error) {
      console.error('Error deleting lead:', error);
      showToast('error', 'Failed to delete lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      setLoading(true);
      await leadService.updateLeadStatus(leadId, newStatus);
      
      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      
      showToast('success', `Lead status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating lead status:', error);
      showToast('error', 'Failed to update lead status');
    } finally {
      setLoading(false);
    }
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
    { 
      key: 'name', 
      label: 'Lead Information',
      render: (value, lead) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {lead.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {lead.notes ? lead.notes.substring(0, 40) + '...' : 'No additional notes'}
            </p>
          </div>
        </div>
      )
    },
    { 
      key: 'email', 
      label: 'Contact Details',
      render: (value, lead) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:text-blue-800 truncate">
              {lead.email}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${lead.phone}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
              {lead.phone}
            </a>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, lead) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
          value === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
          value === 'qualified' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
          value === 'converted' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' :
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
        }`}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ') : 'Unknown'}
        </span>
      )
    },
    { 
      key: 'source', 
      label: 'Lead Source',
      render: (value, lead) => (
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            lead.source === 'website' ? 'bg-blue-500' :
            lead.source === 'social-media' ? 'bg-pink-500' :
            lead.source === 'referral' ? 'bg-green-500' :
            lead.source === 'email-campaign' ? 'bg-purple-500' :
            lead.source === 'advertisement' ? 'bg-orange-500' :
            'bg-gray-500'
          }`}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
            {lead.source ? lead.source.replace('-', ' ') : 'Unknown'}
          </span>
        </div>
      )
    },
    { 
      key: 'created', 
      label: 'Timeline',
      render: (value, lead) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-900 dark:text-white">
            <span className="font-medium">Added:</span> {lead.created}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {lead.updated_at ? `Updated: ${new Date(lead.updated_at).toLocaleDateString()}` : 'Never updated'}
          </div>
        </div>
      )
    },
    {
      key: 'score',
      label: 'Lead Quality',
      render: (value, lead) => {
        // Calculate score and label based on lead status
        const getQualityFromStatus = (status) => {
          switch(status) {
            case 'new': return { score: 20, label: 'Cold' };
            case 'in-progress': return { score: 50, label: 'Warm' };
            case 'converted': return { score: 90, label: 'Hot' };
            case 'closed': return { score: 100, label: 'Client' };
            case 'qualified': return { score: 70, label: 'Good' };
            default: return { score: 0, label: 'Unknown' };
          }
        };
        
        const quality = getQualityFromStatus(lead.status);
        const displayScore = quality.score;
        
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Score</span>
                  <span className="font-medium text-gray-900 dark:text-white">{displayScore}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      displayScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      displayScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      displayScore >= 40 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${displayScore}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(displayScore / 20) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">
                {quality.label}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, lead) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditClick(lead)}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 group"
            title="Edit Lead"
          >
            <PencilIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => handleDeleteClick(lead)}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 group"
            title="Delete Lead"
          >
            <TrashIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {pageLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Leads Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your leads efficiently</p>
            </div>
            
            <Button
              onClick={() => {
                resetForm();
                setShowNewLeadModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Lead</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Leads</p>
                  <p className="text-3xl font-bold">{leads.length}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-sm text-blue-100">
                {leads.length > 0 ? `+${leads.filter(lead => {
                  const created = new Date(lead.created);
                  const today = new Date();
                  return created.toDateString() === today.toDateString();
                }).length} today` : 'No leads yet'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Qualified</p>
                  <p className="text-3xl font-bold">{leads.filter(lead => lead.status === 'qualified').length}</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 rounded-lg p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-sm text-green-100">
                {leads.length > 0 ? `${Math.round((leads.filter(lead => lead.status === 'qualified').length / leads.length) * 100)}% conversion` : '0% conversion'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">In Progress</p>
                  <p className="text-3xl font-bold">{leads.filter(lead => lead.status === 'in-progress').length}</p>
                </div>
                <div className="bg-yellow-400 bg-opacity-30 rounded-lg p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-sm text-yellow-100">
                Active pipeline
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg. Score</p>
                  <p className="text-3xl font-bold">
                    {leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / leads.length) : 0}%
                  </p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 rounded-lg p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-sm text-purple-100">
                Lead quality
              </div>
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
          <LeadFormModal
            isOpen={showNewLeadModal}
            onClose={() => {
              setShowNewLeadModal(false);
              resetForm();
            }}
            title="Add New Lead"
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleCreateLead}
            loading={loading}
            isEditMode={false}
          />

          {/* Edit Lead Modal */}
          <LeadFormModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingLead(null);
              resetForm();
            }}
            title="Edit Lead"
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleUpdateLead}
            loading={loading}
            isEditMode={true}
          />

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setDeletingLead(null);
            }}
            onConfirm={handleDeleteLead}
            title="Delete Lead"
            message={
              deletingLead 
                ? `This will permanently delete "${deletingLead.name}" and all associated data. This action cannot be undone.`
                : "Are you sure you want to delete this lead?"
            }
            confirmText="Delete Lead"
            cancelText="Cancel"
            loading={loading}
            type="danger"
          />

          <Toast
            type={toast.type}
            message={toast.message}
            isVisible={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </>
      )}
    </div>
  );
};

export default Leads;