import React, { useState } from 'react';
import { StatCard } from '../components/ui/StatCard';
import { LineChartCard } from '../components/charts/LineChartCard';
import { PieChartCard } from '../components/charts/PieChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  ChatBubbleBottomCenterTextIcon,
  PlusIcon,
  DocumentArrowDownIcon,
  TicketIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { overviewStats, chartData, leads, appointments, tickets } from '../data/mockData';
import { saveAs } from 'file-saver';

const sparklineData = [65, 78, 90, 85, 98, 87, 105];

export const Dashboard = () => {
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleExportReport = () => {
    setLoading(true);
    setTimeout(() => {
      const csvContent = "Name,Email,Status,Created\n" + 
        leads.map(lead => `${lead.name},${lead.email},${lead.status},${lead.created}`).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'dashboard-report.csv');
      setLoading(false);
      showToast('success', 'Report exported successfully!');
    }, 1500);
  };

  const handleQuickAction = (action) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('success', `${action} completed successfully!`);
    }, 1000);
  };

  const recentColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === 'new' ? 'bg-blue-100 text-blue-800' :
        value === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
        value === 'qualified' ? 'bg-green-100 text-green-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )},
    { key: 'created', label: 'Created' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Leads This Month"
          value={overviewStats.leadsThisMonth.value}
          change={overviewStats.leadsThisMonth.change}
          trend={overviewStats.leadsThisMonth.trend}
          icon={UserGroupIcon}
          sparklineData={sparklineData}
        />
        <StatCard
          title="Appointments"
          value={overviewStats.appointments.value}
          change={overviewStats.appointments.change}
          trend={overviewStats.appointments.trend}
          icon={CalendarDaysIcon}
          sparklineData={sparklineData}
        />
        <StatCard
          title="Conversion Rate"
          value={`${overviewStats.conversionRate.value}%`}
          change={overviewStats.conversionRate.change}
          trend={overviewStats.conversionRate.trend}
          icon={ChartBarSquareIcon}
          sparklineData={sparklineData}
        />
        <StatCard
          title="Engagement"
          value={`${overviewStats.engagement.value}%`}
          change={overviewStats.engagement.change}
          trend={overviewStats.engagement.trend}
          icon={ChatBubbleBottomCenterTextIcon}
          sparklineData={sparklineData}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="primary"
            onClick={() => setShowNewAppointmentModal(true)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Appointment</span>
          </Button>
          <Button
            variant="success"
            onClick={() => setShowTicketModal(true)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <TicketIcon className="w-5 h-5" />
            <span>Raise Ticket</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportReport}
            loading={loading}
            className="w-full flex items-center justify-center space-x-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Export Report</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowNewLeadModal(true)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="Appointment Trends"
          data={chartData.appointments}
          dataKey="appointments"
          color="#3B82F6"
        />
        <PieChartCard
          title="Leads by Source"
          data={chartData.leadsBreakdown}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChartCard
            title="Weekly Engagement"
            data={chartData.weeklyEngagement}
            dataKey="engagement"
            color="#10B981"
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New lead: John Smith</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Appointment confirmed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Support ticket updated</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">10 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Leads</h2>
        <Table
          columns={recentColumns}
          data={leads.slice(0, 5)}
          searchable={true}
          exportable={true}
          onExport={(data) => {
            const csvContent = "Name,Email,Status,Created\n" + 
              data.map(lead => `${lead.name},${lead.email},${lead.status},${lead.created}`).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'leads-export.csv');
            showToast('success', 'Leads exported successfully!');
          }}
          onRowClick={(lead) => showToast('info', `Viewing details for ${lead.name}`)}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        title="Schedule New Appointment"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleQuickAction('New appointment');
          setShowNewAppointmentModal(false);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Patient Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Consultation</option>
              <option>Follow-up</option>
              <option>Initial Meeting</option>
              <option>Assessment</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowNewAppointmentModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Schedule Appointment
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        title="Add New Lead"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleQuickAction('New lead');
          setShowNewLeadModal(false);
        }} className="space-y-4">
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

      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title="Raise Support Ticket"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleQuickAction('Support ticket');
          setShowTicketModal(false);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows="4"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowTicketModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit Ticket
            </Button>
          </div>
        </form>
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