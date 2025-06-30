import React, { useState } from 'react';
import { X, Shield, Users, FileText, Settings, BarChart3, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PendingItem {
  id: string;
  type: 'classified' | 'event' | 'business';
  title: string;
  author: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newThisWeek: number;
  pendingApprovals: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'settings'>('overview');

  // Mock data - in a real app, this would come from your backend
  const [pendingItems] = useState<PendingItem[]>([
    {
      id: '1',
      type: 'classified',
      title: 'iPhone 15 Pro for Sale',
      author: 'John Doe',
      submittedAt: '2024-01-15T10:30:00Z',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '2',
      type: 'event',
      title: 'Diwali Celebration 2024',
      author: 'Community Center',
      submittedAt: '2024-01-15T09:15:00Z',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '3',
      type: 'business',
      title: 'New Indian Restaurant',
      author: 'Raj Patel',
      submittedAt: '2024-01-14T16:45:00Z',
      status: 'pending',
      priority: 'low'
    }
  ]);

  const userStats: UserStats = {
    totalUsers: 1247,
    activeUsers: 892,
    newThisWeek: 23,
    pendingApprovals: pendingItems.length
  };

  const handleApprove = (itemId: string) => {
    console.log('Approving item:', itemId);
    // In a real app, this would call your backend API
    alert(`Item ${itemId} approved successfully!`);
  };

  const handleReject = (itemId: string) => {
    console.log('Rejecting item:', itemId);
    // In a real app, this would call your backend API
    const reason = prompt('Reason for rejection (optional):');
    alert(`Item ${itemId} rejected. Reason: ${reason || 'No reason provided'}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.ceil(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'classified': return '🏷️';
      case 'event': return '📅';
      case 'business': return '🏢';
      default: return '📄';
    }
  };

  if (!isOpen) return null;

  // Check permissions
  if (!user || !hasPermission('manage_roles')) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Access Denied</h3>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-red-100">Upkaar Community Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                  activeTab === 'overview' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('content')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                  activeTab === 'content' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Content Review</span>
                {pendingItems.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingItems.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                  activeTab === 'users' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                  activeTab === 'settings' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Dashboard Overview</h3>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Users</p>
                        <p className="text-3xl font-bold text-blue-900">{userStats.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Active Users</p>
                        <p className="text-3xl font-bold text-green-900">{userStats.activeUsers.toLocaleString()}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">New This Week</p>
                        <p className="text-3xl font-bold text-purple-900">{userStats.newThisWeek}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Pending Reviews</p>
                        <p className="text-3xl font-bold text-orange-900">{userStats.pendingApprovals}</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">New user registration: priya.sharma@email.com</span>
                      <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Classified ad submitted for review</span>
                      <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Event approval requested</span>
                      <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Content Review</h3>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingItems.length} items pending
                  </span>
                </div>
                
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{getTypeIcon(item.type)}</span>
                            <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority} priority
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>By: {item.author}</span>
                            <span>•</span>
                            <span>Submitted: {formatDate(item.submittedAt)}</span>
                            <span>•</span>
                            <span className="capitalize">{item.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {pendingItems.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h4>
                      <p className="text-gray-600">No content pending review at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-600">User management features will be implemented here.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    This would include user roles, permissions, account status, and moderation tools.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">System Settings</h3>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-600">System configuration options will be available here.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    This would include site settings, email templates, moderation rules, and feature toggles.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;