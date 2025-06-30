import React, { useState } from 'react';
import { X, Shield, Users, FileText, Settings, BarChart3, AlertTriangle, CheckCircle, Clock, Eye, Edit, Trash2, UserCheck, UserX, Ban, Mail, Phone, MapPin, Calendar, Search, Filter, MoreVertical } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { useClassifieds } from '../hooks/useClassifieds';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newThisWeek: number;
  pendingApprovals: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { user, hasPermission } = useAuth();
  const { users, isLoading: usersLoading, updateUserRole, updateUserStatus, deleteUser } = useUsers();
  const { classifieds, isLoading: classifiedsLoading, approveClassified, rejectClassified } = useClassifieds();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'settings'>('overview');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [contentStatusFilter, setContentStatusFilter] = useState('pending');
  const [showUserActions, setShowUserActions] = useState<string | null>(null);

  // Check what permissions the user has
  const canManageUsers = hasPermission('manage_roles');
  const canReviewContent = hasPermission('approve_content');
  const canAccessOverview = canManageUsers || canReviewContent;

  // Filter pending content items
  const pendingClassifieds = classifieds.filter(ad => ad.status === 'pending');
  const allContentItems = classifieds.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(contentSearchTerm.toLowerCase());
    const matchesStatus = contentStatusFilter === 'all' || ad.status === contentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const userStats: UserStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    newThisWeek: users.filter(u => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(u.createdAt) > weekAgo;
    }).length,
    pendingApprovals: pendingClassifieds.length
  };

  const handleApprove = async (itemId: string) => {
    try {
      await approveClassified(itemId);
      alert(`Item ${itemId} approved successfully!`);
    } catch (error) {
      alert('Failed to approve item. Please try again.');
    }
  };

  const handleReject = async (itemId: string) => {
    const reason = prompt('Reason for rejection (optional):');
    try {
      await rejectClassified(itemId, reason || 'No reason provided');
      alert(`Item ${itemId} rejected.`);
    } catch (error) {
      alert('Failed to reject item. Please try again.');
    }
  };

  const handleUserRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole as any);
      alert('User role updated successfully!');
    } catch (error) {
      alert('Failed to update user role. Please try again.');
    }
  };

  const handleUserStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      await updateUserStatus(userId, !isActive);
      alert(`User ${!isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        alert('User deleted successfully!');
      } catch (error) {
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleBulkUserAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first.');
      return;
    }

    if (confirm(`Are you sure you want to ${action} ${selectedUsers.length} users?`)) {
      try {
        for (const userId of selectedUsers) {
          switch (action) {
            case 'activate':
              await updateUserStatus(userId, true);
              break;
            case 'deactivate':
              await updateUserStatus(userId, false);
              break;
            case 'delete':
              await deleteUser(userId);
              break;
          }
        }
        setSelectedUsers([]);
        alert(`Successfully ${action}d ${selectedUsers.length} users.`);
      } catch (error) {
        alert(`Failed to ${action} users. Please try again.`);
      }
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'moderator': return 'text-orange-600 bg-orange-100';
      case 'content_manager': return 'text-purple-600 bg-purple-100';
      case 'vendor': return 'text-blue-600 bg-blue-100';
      case 'user': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  // Check permissions - allow access if user can review content OR manage roles
  if (!user || (!canAccessOverview)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Access Denied</h3>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel. You need either content review or user management permissions.
          </p>
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
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {canManageUsers ? 'Admin Panel' : 'Moderator Panel'}
              </h2>
              <p className="text-red-100">
                {canManageUsers ? 'Upkaar Community Management' : 'Content Review & Moderation'}
              </p>
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
              {canAccessOverview && (
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
              )}
              
              {canReviewContent && (
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
                  {pendingClassifieds.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {pendingClassifieds.length}
                    </span>
                  )}
                </button>
              )}
              
              {canManageUsers && (
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
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {users.length}
                  </span>
                </button>
              )}
              
              {canManageUsers && (
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
              )}
            </div>

            {/* User Role Info */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Your Permissions</h4>
              <div className="space-y-1">
                {canReviewContent && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Content Review</span>
                  </div>
                )}
                {canManageUsers && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">User Management</span>
                  </div>
                )}
                {!canManageUsers && !canReviewContent && (
                  <div className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-700">Limited Access</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && canAccessOverview && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Dashboard Overview</h3>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {canManageUsers && (
                    <>
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
                    </>
                  )}
                  
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Pending Reviews</p>
                        <p className="text-3xl font-bold text-orange-900">{userStats.pendingApprovals}</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>

                  {!canManageUsers && (
                    <>
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">Total Content</p>
                            <p className="text-3xl font-bold text-blue-900">{classifieds.length}</p>
                          </div>
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">Approved</p>
                            <p className="text-3xl font-bold text-green-900">
                              {classifieds.filter(c => c.status === 'approved').length}
                            </p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {canManageUsers ? (
                      users.slice(0, 5).map((user, index) => (
                        <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">New user registration: {user.email}</span>
                          <span className="text-xs text-gray-500 ml-auto">{formatDate(user.createdAt)}</span>
                        </div>
                      ))
                    ) : (
                      classifieds.slice(0, 5).map((ad, index) => (
                        <div key={ad.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            ad.status === 'pending' ? 'bg-yellow-500' : 
                            ad.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm text-gray-700">
                            {ad.status === 'pending' ? 'New' : ad.status.charAt(0).toUpperCase() + ad.status.slice(1)} classified: {ad.title}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">{formatDate(ad.createdAt)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && canReviewContent && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Content Management</h3>
                  <div className="flex items-center space-x-4">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {pendingClassifieds.length} pending
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {classifieds.length} total
                    </span>
                  </div>
                </div>

                {/* Content Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search content..."
                        value={contentSearchTerm}
                        onChange={(e) => setContentSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <select
                      value={contentStatusFilter}
                      onChange={(e) => setContentStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
                
                {classifiedsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading content...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allContentItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">🏷️</span>
                              <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                              {item.featured && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>By: {item.authorName}</span>
                              <span>•</span>
                              <span>Category: {item.category}</span>
                              <span>•</span>
                              <span>Location: {item.location}</span>
                              <span>•</span>
                              <span>Created: {formatDate(item.createdAt)}</span>
                              {item.price && (
                                <>
                                  <span>•</span>
                                  <span className="font-medium text-green-600">${item.price}</span>
                                </>
                              )}
                            </div>
                            {item.rejectionReason && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">
                                  <strong>Rejection Reason:</strong> {item.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {item.status === 'pending' && (
                              <>
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
                              </>
                            )}
                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {allContentItems.length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                          {contentStatusFilter === 'pending' ? 'All caught up!' : 'No content found'}
                        </h4>
                        <p className="text-gray-600">
                          {contentStatusFilter === 'pending' 
                            ? 'No content pending review at the moment.' 
                            : 'No content matches your current filters.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && canManageUsers && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
                  <div className="flex items-center space-x-4">
                    {selectedUsers.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
                        <button
                          onClick={() => handleBulkUserAction('activate')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => handleBulkUserAction('deactivate')}
                          className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() => handleBulkUserAction('delete')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="content_manager">Content Manager</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {usersLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left">
                              <input
                                type="checkbox"
                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers(filteredUsers.map(u => u.id));
                                  } else {
                                    setSelectedUsers([]);
                                  }
                                }}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                              />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedUsers([...selectedUsers, user.id]);
                                    } else {
                                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                    }
                                  }}
                                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                  {user.role.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.isActive 
                                    ? 'text-green-600 bg-green-100' 
                                    : 'text-red-600 bg-red-100'
                                }`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="relative">
                                  <button
                                    onClick={() => setShowUserActions(showUserActions === user.id ? null : user.id)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                  >
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                  </button>
                                  
                                  {showUserActions === user.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                      <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">Change Role</p>
                                      </div>
                                      {['user', 'vendor', 'content_manager', 'moderator', 'admin'].map((role) => (
                                        <button
                                          key={role}
                                          onClick={() => {
                                            handleUserRoleChange(user.id, role);
                                            setShowUserActions(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          {role.replace('_', ' ')}
                                        </button>
                                      ))}
                                      <div className="border-t border-gray-200 mt-2 pt-2">
                                        <button
                                          onClick={() => {
                                            handleUserStatusToggle(user.id, user.isActive);
                                            setShowUserActions(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                          {user.isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                          <span>{user.isActive ? 'Deactivate' : 'Activate'}</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleDeleteUser(user.id);
                                            setShowUserActions(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                          <span>Delete User</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">No users found</h4>
                        <p className="text-gray-600">No users match your current filters.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && canManageUsers && (
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

            {/* Access Denied for specific tabs */}
            {((activeTab === 'users' && !canManageUsers) || (activeTab === 'settings' && !canManageUsers)) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Access Denied</h3>
                <p className="text-gray-600 mb-6">
                  You don't have permission to access this section. Admin privileges required.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;