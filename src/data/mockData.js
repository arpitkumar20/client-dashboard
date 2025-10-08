// Mock data for the entire application
export const overviewStats = {
  leadsThisMonth: { value: 127, change: 12.3, trend: 'up' },
  appointments: { value: 89, change: -3.2, trend: 'down' },
  conversionRate: { value: 23.4, change: 5.1, trend: 'up' },
  engagement: { value: 78.9, change: 2.8, trend: 'up' }
};

export const chartData = {
  appointments: [
    { month: 'Jan', appointments: 65 },
    { month: 'Feb', appointments: 78 },
    { month: 'Mar', appointments: 90 },
    { month: 'Apr', appointments: 85 },
    { month: 'May', appointments: 98 },
    { month: 'Jun', appointments: 87 },
    { month: 'Jul', appointments: 105 },
    { month: 'Aug', appointments: 98 },
    { month: 'Sep', appointments: 112 },
    { month: 'Oct', appointments: 89 },
    { month: 'Nov', appointments: 95 },
    { month: 'Dec', appointments: 108 }
  ],
  leadsBreakdown: [
    { name: 'Website', value: 45, color: '#3B82F6' },
    { name: 'Referrals', value: 30, color: '#10B981' },
    { name: 'Social Media', value: 15, color: '#F59E0B' },
    { name: 'Direct', value: 10, color: '#EF4444' }
  ],
  weeklyEngagement: [
    { week: 'W1', engagement: 85 },
    { week: 'W2', engagement: 92 },
    { week: 'W3', engagement: 78 },
    { week: 'W4', engagement: 95 },
    { week: 'W5', engagement: 89 },
    { week: 'W6', engagement: 88 },
    { week: 'W7', engagement: 94 }
  ]
};

export const leads = [
  { id: 1, name: 'John Smith', email: 'john@email.com', phone: '+1-555-0123', status: 'new', source: 'Website', created: '2024-01-15', score: 85 },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0124', status: 'in-progress', source: 'Referral', created: '2024-01-14', score: 92 },
  { id: 3, name: 'Mike Davis', email: 'mike@email.com', phone: '+1-555-0125', status: 'qualified', source: 'Social Media', created: '2024-01-13', score: 78 },
  { id: 4, name: 'Emily Brown', email: 'emily@email.com', phone: '+1-555-0126', status: 'closed', source: 'Direct', created: '2024-01-12', score: 95 },
  { id: 5, name: 'David Wilson', email: 'david@email.com', phone: '+1-555-0127', status: 'new', source: 'Website', created: '2024-01-11', score: 67 }
];

export const appointments = [
  { id: 1, title: 'Consultation - John Smith', date: '2024-01-20', time: '10:00', status: 'confirmed', type: 'consultation' },
  { id: 2, title: 'Follow-up - Sarah Johnson', date: '2024-01-21', time: '14:30', status: 'pending', type: 'follow-up' },
  { id: 3, title: 'Initial Meeting - Mike Davis', date: '2024-01-22', time: '09:15', status: 'confirmed', type: 'initial' },
  { id: 4, title: 'Review Session - Emily Brown', date: '2024-01-23', time: '16:00', status: 'cancelled', type: 'review' },
  { id: 5, title: 'Assessment - David Wilson', date: '2024-01-24', time: '11:30', status: 'confirmed', type: 'assessment' }
];

export const tickets = [
  { id: 1, subject: 'Login Issues', priority: 'high', status: 'open', created: '2024-01-15', assignee: 'Support Team' },
  { id: 2, subject: 'Feature Request', priority: 'medium', status: 'in-progress', created: '2024-01-14', assignee: 'Dev Team' },
  { id: 3, subject: 'Data Export Problem', priority: 'low', status: 'resolved', created: '2024-01-13', assignee: 'Tech Support' },
  { id: 4, subject: 'UI Bug Report', priority: 'medium', status: 'open', created: '2024-01-12', assignee: 'QA Team' },
  { id: 5, subject: 'Integration Help', priority: 'high', status: 'in-progress', created: '2024-01-11', assignee: 'Support Team' }
];

export const users = [
  { id: 1, name: 'Admin User', email: 'admin@hospital.com', role: 'admin', status: 'active', lastLogin: '2024-01-15' },
  { id: 2, name: 'John Manager', email: 'john@hospital.com', role: 'manager', status: 'active', lastLogin: '2024-01-14' },
  { id: 3, name: 'Sarah Receptionist', email: 'sarah@hospital.com', role: 'front-desk', status: 'active', lastLogin: '2024-01-13' },
  { id: 4, name: 'Mike Support', email: 'mike@hospital.com', role: 'support', status: 'inactive', lastLogin: '2024-01-10' }
];

export const faqs = [
  { id: 1, question: 'How do I book an appointment?', answer: 'You can book an appointment through our online portal or by calling our front desk.', category: 'general', status: 'active' },
  { id: 2, question: 'What are your visiting hours?', answer: 'Our visiting hours are 9 AM to 9 PM daily.', category: 'visiting', status: 'active' },
  { id: 3, question: 'How do I cancel an appointment?', answer: 'Please call us at least 24 hours in advance to cancel your appointment.', category: 'appointments', status: 'active' }
];

export const integrations = [
  { id: 1, name: 'Salesforce CRM', type: 'CRM', status: 'connected', lastSync: '2024-01-15 10:30' },
  { id: 2, name: 'SAP ERP', type: 'ERP', status: 'disconnected', lastSync: '2024-01-10 15:45' },
  { id: 3, name: 'Opera PMS', type: 'PMS', status: 'connected', lastSync: '2024-01-15 09:20' },
  { id: 4, name: 'Mailchimp', type: 'Marketing', status: 'connected', lastSync: '2024-01-15 11:15' }
];