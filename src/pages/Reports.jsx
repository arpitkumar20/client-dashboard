import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { 
  DocumentTextIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { saveAs } from 'file-saver';

const reportTypes = [
  {
    id: 'leads',
    name: 'Leads Report',
    description: 'Comprehensive leads analysis and conversion metrics',
    icon: ChartBarIcon,
    lastGenerated: '2024-01-15',
    size: '2.4 MB'
  },
  {
    id: 'appointments',
    name: 'Appointments Report',
    description: 'Appointment statistics and scheduling trends',
    icon: CalendarIcon,
    lastGenerated: '2024-01-14',
    size: '1.8 MB'
  },
  {
    id: 'performance',
    name: 'Performance Report',
    description: 'Overall system performance and user engagement',
    icon: DocumentChartBarIcon,
    lastGenerated: '2024-01-13',
    size: '3.2 MB'
  },
  {
    id: 'financial',
    name: 'Financial Summary',
    description: 'Revenue tracking and financial analytics',
    icon: DocumentTextIcon,
    lastGenerated: '2024-01-12',
    size: '1.1 MB'
  }
];

const scheduledReports = [
  {
    id: 1,
    name: 'Weekly Leads Summary',
    frequency: 'Weekly',
    nextRun: '2024-01-22',
    recipients: 'admin@hospital.com, manager@hospital.com',
    status: 'active'
  },
  {
    id: 2,
    name: 'Monthly Performance Review',
    frequency: 'Monthly',
    nextRun: '2024-02-01',
    recipients: 'admin@hospital.com',
    status: 'active'
  },
  {
    id: 3,
    name: 'Daily Appointment Summary',
    frequency: 'Daily',
    nextRun: '2024-01-16',
    recipients: 'frontdesk@hospital.com',
    status: 'paused'
  }
];

export const Reports = () => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleGenerateReport = (reportType) => {
    setSelectedReport(reportType);
    setShowGenerateModal(true);
  };

  const handleDownloadReport = (reportType) => {
    setLoading(true);
    setTimeout(() => {
      // Simulate report generation and download
      const csvContent = `Report: ${reportType.name}\nGenerated: ${new Date().toISOString()}\nData: Sample report data...`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${reportType.id}-report-${new Date().toISOString().split('T')[0]}.csv`);
      setLoading(false);
      showToast('success', `${reportType.name} downloaded successfully!`);
    }, 2000);
  };

  const handleViewReport = (reportType) => {
    setViewingReport(reportType);
    setShowViewerModal(true);
  };

  const handleScheduleReport = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowScheduleModal(false);
      showToast('success', 'Report scheduled successfully!');
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and manage your business reports</p>
        </div>
        <Button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center space-x-2"
        >
          <CalendarIcon className="w-5 h-5" />
          <span>Schedule Report</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Reports</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{reportTypes.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scheduled Reports</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {scheduledReports.filter(r => r.status === 'active').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Generated</h3>
          <p className="text-lg font-bold text-purple-600 mt-2">Today</p>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Reports</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{report.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                          <span>Last: {report.lastGenerated}</span>
                          <span>Size: {report.size}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => handleGenerateReport(report)}
                      className="flex items-center space-x-2"
                    >
                      <DocumentChartBarIcon className="w-4 h-4" />
                      <span>Generate</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewReport(report)}
                      className="flex items-center space-x-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>Preview</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadReport(report)}
                      loading={loading}
                      className="flex items-center space-x-2"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scheduled Reports</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{report.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{report.frequency}</span>
                    <span>Next: {report.nextRun}</span>
                    <span>Recipients: {report.recipients}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {report.status}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => showToast('success', `Report ${report.status === 'active' ? 'paused' : 'resumed'}`)}
                  >
                    {report.status === 'active' ? 'Pause' : 'Resume'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => {
          setShowGenerateModal(false);
          setSelectedReport(null);
        }}
        title={`Generate ${selectedReport?.name}`}
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setShowGenerateModal(false);
            setSelectedReport(null);
            showToast('success', 'Report generated and ready for download!');
          }, 2000);
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                required
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                required
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Include Sections
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Summary</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Detailed Data</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Charts & Graphs</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowGenerateModal(false);
                setSelectedReport(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Generate Report
            </Button>
          </div>
        </form>
      </Modal>

      {/* Schedule Report Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Report"
        size="md"
      >
        <form onSubmit={handleScheduleReport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Weekly Sales Summary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipients (comma separated)
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@company.com, manager@company.com"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowScheduleModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Schedule Report
            </Button>
          </div>
        </form>
      </Modal>

      {/* Report Viewer Modal */}
      <Modal
        isOpen={showViewerModal}
        onClose={() => {
          setShowViewerModal(false);
          setViewingReport(null);
        }}
        title={`Preview: ${viewingReport?.name}`}
        size="xl"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Report Preview</h3>
            <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Report preview would be displayed here. This is a secure preview of your {viewingReport?.name}.
              </p>
              <div className="mt-4 text-sm text-gray-400">
                <p>Report generated on: {new Date().toLocaleDateString()}</p>
                <p>Contains: Sample data visualization and analytics</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowViewerModal(false);
                setViewingReport(null);
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (viewingReport) {
                  handleDownloadReport(viewingReport);
                }
                setShowViewerModal(false);
                setViewingReport(null);
              }}
            >
              Download Full Report
            </Button>
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