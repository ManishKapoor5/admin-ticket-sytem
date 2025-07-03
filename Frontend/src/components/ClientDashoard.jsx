import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Settings,
  Home,
  Ticket,
  Users,
  BarChart3,
  Bell
} from 'lucide-react';

// Mock data for demonstration
const mockTickets = [
  {
    id: 'TCK-001',
    title: 'Login Issues',
    description: 'Unable to login to the system with correct credentials. The error message "Invalid username or password" is shown, even though the details are correct. This has been happening since the last update.',
    priority: 'high',
    status: 'open',
    category: 'technical',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    assignedTo: null,
    comments: []
  },
  {
    id: 'TCK-002',
    title: 'Feature Request: Dark Mode',
    description: 'Request to add a dark mode theme to the application to reduce eye strain during night-time use. This would be a great addition for user experience.',
    priority: 'medium',
    status: 'in_progress',
    category: 'feature',
    clientName: 'Jane Smith',
    clientEmail: 'jane@example.com',
    createdAt: '2025-01-14T14:20:00Z',
    updatedAt: '2025-01-15T09:15:00Z',
    assignedTo: 'Developer A',
    comments: [
      { id: 1, author: 'Admin', text: 'Working on this feature, we expect to release it next month.', timestamp: '2025-01-15T09:15:00Z' }
    ]
  }
];

const ClientDashboard = () => {
  const [currentView, setCurrentView] = useState('client'); // 'client' or 'admin'
  const [tickets, setTickets] = useState(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [assignee, setAssignee] = useState('');

  // Client form state
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'technical',
    clientName: 'Current User', // This would typically be dynamic
    clientEmail: 'user@example.com' // This would typically be dynamic
  });

  // Filter tickets based on search and filters
  useEffect(() => {
    let filtered = tickets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  // Create new ticket
  const handleCreateTicket = (e) => {
    e.preventDefault();
    const ticket = {
      ...newTicket,
      id: `TCK-${String(tickets.length + 1).padStart(3, '0')}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: null,
      comments: []
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({
      title: '',
      description: '',
      priority: 'medium',
      category: 'technical',
      clientName: 'Current User',
      clientEmail: 'user@example.com'
    });
    setIsCreateModalOpen(false);
  };

  // Update ticket status (Admin function)
  const updateTicketStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    );
    setTickets(updatedTickets);
    if(selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({...selectedTicket, status: newStatus});
    }
  };

  // Assign ticket (Admin function)
  const assignTicket = (ticketId, assignee) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, assignedTo: assignee, updatedAt: new Date().toISOString() }
        : ticket
    );
    setTickets(updatedTickets);
     if(selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({...selectedTicket, assignedTo: assignee});
    }
    setAssignee('');
  };

  // Delete ticket (Admin function)
  const deleteTicket = (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    }
  };

  // Add comment to ticket
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const updatedTickets = tickets.map(ticket =>
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            comments: [...ticket.comments, {
              id: ticket.comments.length + 1,
              author: currentView === 'admin' ? 'Admin' : 'Client',
              text: newComment,
              timestamp: new Date().toISOString()
            }],
            updatedAt: new Date().toISOString()
          }
        : ticket
    );
    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id));
    setNewComment('');
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get stats for dashboard
  const getStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentView === 'client' ? 'Client Dashboard' : 'Admin Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView(currentView === 'client' ? 'admin' : 'client')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Switch to {currentView === 'client' ? 'Admin' : 'Client'} View
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Client Dashboard */}
      {currentView === 'client' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Client Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Support Tickets</h2>
                <p className="text-gray-600">Create and track your support requests</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Create Ticket</span>
              </button>
            </div>
          </div>

          {/* Client Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Cards for stats */}
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><Ticket className="text-blue-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">Total Tickets</p><p className="text-2xl font-semibold">{stats.total}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><Clock className="text-yellow-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">In Progress</p><p className="text-2xl font-semibold">{stats.inProgress}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><CheckCircle className="text-green-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">Resolved</p><p className="text-2xl font-semibold">{stats.resolved}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><AlertTriangle className="text-red-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">Urgent</p><p className="text-2xl font-semibold">{stats.urgent}</p></div></div></div>
          </div>

          {/* Client Tickets List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="divide-y">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2"><h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span></div>
                      <p className="text-gray-600 mb-3">{ticket.description.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500"><span className="flex items-center space-x-1"><Calendar size={16} /><span>Created {formatDate(ticket.createdAt)}</span></span><span>ID: {ticket.id}</span>{ticket.assignedTo && (<span className="flex items-center space-x-1"><User size={16} /><span>Assigned to {ticket.assignedTo}</span></span>)}{ticket.comments.length > 0 && (<span className="flex items-center space-x-1"><MessageSquare size={16} /><span>{ticket.comments.length} comments</span></span>)}</div>
                    </div>
                    <button onClick={() => { setSelectedTicket(ticket); setIsViewModalOpen(true); }} className="ml-4 flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
              {filteredTickets.length === 0 && (
                <div className="p-12 text-center"><Ticket className="mx-auto text-gray-400 mb-4" size={48} /><h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3><p className="text-gray-600">Create your first support ticket to get started.</p></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {currentView === 'admin' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Ticket Management</h2>
            <p className="text-gray-600">Manage and resolve customer support tickets</p>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {/* Cards for stats */}
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><BarChart3 className="text-blue-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">Total Tickets</p><p className="text-2xl font-semibold">{stats.total}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><AlertTriangle className="text-blue-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">Open</p><p className="text-2xl font-semibold">{stats.open}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><Clock className="text-yellow-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">In Progress</p><p className="text-2xl font-semibold">{stats.inProgress}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><CheckCircle className="text-green-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">Resolved</p><p className="text-2xl font-semibold">{stats.resolved}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="flex items-center"><Bell className="text-red-600" size={24} /><div className="ml-4"><p className="text-sm text-gray-600">Urgent</p><p className="text-2xl font-semibold">{stats.urgent}</p></div></div></div>
          </div>

          {/* Admin Tickets Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="divide-y">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2"><h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span></div>
                      <p className="text-gray-600 mb-3">{ticket.description.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500"><span className="flex items-center space-x-1"><User size={16} /><span>{ticket.clientName}</span></span><span className="flex items-center space-x-1"><Calendar size={16} /><span>Created {formatDate(ticket.createdAt)}</span></span><span>ID: {ticket.id}</span>{ticket.assignedTo ? (<span className="text-blue-600">Assigned to {ticket.assignedTo}</span>) : (<span className="text-gray-500">Unassigned</span>)}{ticket.comments.length > 0 && (<span className="flex items-center space-x-1"><MessageSquare size={16} /><span>{ticket.comments.length} comments</span></span>)}</div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <select className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={ticket.status} onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button onClick={() => { setSelectedTicket(ticket); setIsViewModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View Details"><Eye size={16} /></button>
                      <button onClick={() => deleteTicket(ticket.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete Ticket"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTickets.length === 0 && (
                <div className="p-12 text-center"><Ticket className="mx-auto text-gray-400 mb-4" size={48} /><h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3><p className="text-gray-600">No tickets match your current filters.</p></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Ticket</h3>
            <form onSubmit={handleCreateTicket}>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTicket.title} onChange={(e) => setNewTicket({...newTicket, title: e.target.value})} placeholder="Brief description of the issue"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTicket.category} onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}><option value="technical">Technical Issue</option><option value="feature">Feature Request</option><option value="billing">Billing</option><option value="general">General Inquiry</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label><select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTicket.priority} onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea required rows={4} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newTicket.description} onChange={(e) => setNewTicket({...newTicket, description: e.target.value})} placeholder="Please provide detailed information about your issue"/></div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{selectedTicket.title}</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status.replace('_', ' ')}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority}</span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedTicket.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm border-t border-b py-4">
                <div><span className="font-medium text-gray-900">Ticket ID:</span><p className="text-gray-600">{selectedTicket.id}</p></div>
                <div><span className="font-medium text-gray-900">Client:</span><p className="text-gray-600">{selectedTicket.clientName} ({selectedTicket.clientEmail})</p></div>
                <div><span className="font-medium text-gray-900">Category:</span><p className="text-gray-600 capitalize">{selectedTicket.category}</p></div>
                <div><span className="font-medium text-gray-900">Assigned To:</span><p className="text-gray-600">{selectedTicket.assignedTo || 'Unassigned'}</p></div>
                <div><span className="font-medium text-gray-900">Created:</span><p className="text-gray-600">{formatDate(selectedTicket.createdAt)}</p></div>
                <div><span className="font-medium text-gray-900">Last Updated:</span><p className="text-gray-600">{formatDate(selectedTicket.updatedAt)}</p></div>
              </div>

              {/* Admin-only Assignment */}
              {currentView === 'admin' && (
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Assign Ticket</h4>
                    <div className="flex gap-2">
                        <input type="text" value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Enter assignee name..." className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={() => assignTicket(selectedTicket.id, assignee)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Assign</button>
                    </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Conversation</h4>
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                    {selectedTicket.comments.length > 0 ? selectedTicket.comments.map(comment => (
                        <div key={comment.id} className="p-3 rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center text-sm mb-1">
                                <p className="font-semibold text-gray-800">{comment.author}</p>
                                <p className="text-gray-500">{formatDate(comment.timestamp)}</p>
                            </div>
                            <p className="text-gray-700">{comment.text}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm">No comments yet.</p>
                    )}
                </div>
                <form onSubmit={handleAddComment}>
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} rows="3" placeholder="Add a comment..." className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"></textarea>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Post Comment</button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;