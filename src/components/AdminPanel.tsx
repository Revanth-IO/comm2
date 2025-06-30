import React, { useState, useEffect } from 'react';
import { X, Shield, Users, FileText, Settings, BarChart3, AlertTriangle, CheckCircle, Clock, Eye, Edit, Trash2, UserCheck, UserX, Ban, Mail, Phone, MapPin, Calendar, Search, Filter, MoreVertical, RefreshCw } from 'lucide-react';
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
  const { classifieds, isLoading: classifiedsLoading, approveClassified, rejectClassified, refetch, lastUpdate } = useClassifieds();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'settings'>('overview');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [contentStatusFilter, setContentStatusFilter] = useState('pending');
  const [showUserActions, setShowUserActions] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize component safely
  useEffect(() => {
    if (isOpen) {
      setIsInitialized(true);
    }
  }, [isOpen]);

  // Auto-refresh content when lastUpdate changes
  useEffect(() => {
    if (lastUpdate && activeTab === 'content') {
      console.log('🔄 Content updated, refreshing view');
    }
  }, [lastUpdate, activeTab]);

  // Check what permissions the user has
  const canManageUsers = user ? hasPermission('manage_roles') : false;
  const canReviewContent = user ? hasPermission('approve_content') : false;
  const canAccessOverview = canManageUsers || canReviewContent;

  // Safe array operations with fallbacks
  const safeClassifieds = Array.isArray(classifieds) ? classifieds : [];
  const safeUsers = Array.isArray(users) ? users : [];

  // Filter pending content items safely
  const pendingClassifieds = safeClassifieds.filter(ad => ad && ad.status === 'pending');
  const allContentItems = safeClassifieds.filter(ad => {
    if (!ad) return false;
    
    const matchesSearch = (ad.title || '').toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
                         (ad.description || '').toLowerCase().includes(contentSearchTerm.toLowerCase());
    const matchesStatus = contentStatusFilter === 'all' || ad.status === contentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter users safely
  const filteredUsers = safeUsers.filter(u => {
    if (!u) return false;
    
    const matchesSearch = (u.name || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const userStats: UserStats = {
    totalUsers: safeUsers.length,
    activeUsers: safeUsers.filter(u => u && u.isActive).length,
    newThisWeek: safeUsers.filter(u => {
      if (!u || !u.createdAt) return false;
      try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(u.createdAt) > weekAgo;
      } catch {
        return false;
      }
    }).length,
    pendingApprovals: pendingClassifieds.length
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      console.log('✅ Content refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh content:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleApprove = async (itemId: string) => {
    try {
      console.log('🔄 Admin panel approving item:', itemId);
      await approveClassified(itemId);
      
      // Show success feedback
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = '✅ Item approved successfully!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
      console.log('✅ Item approved successfully from admin panel');
    } catch (error) {
      console.error('❌ Error approving item:', error);
      
      // Show error feedback
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = '❌ Failed to approve item. Please try again.';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };

  const handleReject = async (itemId: string) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return; // User cancelled
    
    try {
      console.log('🔄 Admin panel rejecting item:', itemId, 'Reason:', reason);
      await rejectClassified(itemId, reason || 'No reason provided');
      
      // Show success feedback
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = '✅ Item rejected successfully!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
      console.log('✅ Item rejected successfully from admin panel');
    } catch (error) {
      console.error('❌ Error rejecting item:', error);
      
      // Show error feedback
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = '❌ Failed to reject item. Please try again.';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };

  const handleUserRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole as any);
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. Please try again.');
    }
  };

  const handleUserStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      await updateUserStatus(userId, !isActive);
      alert(`User ${!isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
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
        console.error(`Error ${action}ing users:`, error);
        alert(`Failed to ${action} users. Please try again.`);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Unknown';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.ceil(diffHours / 24);
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
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

  // Close user actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserActions(null);
    };

    if (showUserActions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserActions]);

  if (!isOpen || !isInitialized) return null;

  // Check permissions - allow access if user can review content OR manage roles
  if (!user || !canAccessOverview) {
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
          <div className="flex items-center space-x-2">
            {activeTab === 'content' && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                title="Refresh Content"
              >
                <RefreshCw className={`w-5 h-5 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
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
                    {safeUsers.length}
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

            {/* Debug Info */}
            {activeTab === 'content' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-xs font-medium text-blue-900 mb-2">Debug Info</h4>
                <div className="space-y-1 text-xs text-blue-800">
                  <div>Total: {safeClassifieds.length}</div>
                  <div>Pending: {pendingClassifieds.length}</div>
                  <div>Approved: {safeClassifieds.filter(c => c?.status === 'approved').length}</div>
                  <div>Rejected: {safeClassifieds.filter(c => c?.status === 'rejected').length}</div>
                  <div>Last Update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'content' && canReviewContent && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Content Management</h3>
                  <div className="flex items-center space-x-4">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {pendingClassifieds.length} pending
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {safeClassifieds.length} total
                    </span>
                    {lastUpdate && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Updated: {new Date(lastUpdate).toLocaleTimeString()}
                      </span>
                    )}
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
                      <div key={item?.id || Math.random()} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">🏷️</span>
                              <h4 className="text-lg font-semibold text-gray-900">{item?.title || 'Untitled'}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item?.status || 'unknown')}`}>
                                {item?.status || 'unknown'}
                              </span>
                              {item?.featured && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{item?.description || 'No description'}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>By: {item?.authorName || 'Unknown'}</span>
                              <span>•</span>
                              <span>Category: {item?.category || 'Unknown'}</span>
                              <span>•</span>
                              <span>Location: {item?.location || 'Unknown'}</span>
                              <span>•</span>
                              <span>Created: {formatDate(item?.createdAt || '')}</span>
                              {item?.price && (
                                <>
                                  <span>•</span>
                                  <span className="font-medium text-green-600">${item.price}</span>
                                </>
                              )}
                            </div>
                            {item?.rejectionReason && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">
                                  <strong>Rejection Reason:</strong> {item.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {item?.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(item.id)}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleReject(item.id)}
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
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

            {/* Other tabs remain the same... */}
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
                            <p className="text-3xl font-bold text-blue-900">{safeClassifieds.length}</p>
                          </div>
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">Approved</p>
                            <p className="text-3xl font-bold text-green-900">
                              {safeClassifieds.filter(c => c && c.status === 'approved').length}
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
                      safeUsers.slice(0, 5).map((user, index) => (
                        <div key={user?.id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">New user registration: {user?.email || 'Unknown'}</span>
                          <span className="text-xs text-gray-500 ml-auto">{formatDate(user?.createdAt || '')}</span>
                        </div>
                      ))
                    ) : (
                      safeClassifieds.slice(0, 5).map((ad, index) => (
                        <div key={ad?.id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            ad?.status === 'pending' ? 'bg-yellow-500' : 
                            ad?.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm text-gray-700">
                            {ad?.status === 'pending' ? 'New' : (ad?.status || 'unknown').charAt(0).toUpperCase() + (ad?.status || 'unknown').slice(1)} classified: {ad?.title || 'Untitled'}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">{formatDate(ad?.createdAt || '')}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Users and Settings tabs remain unchanged... */}
            {activeTab === 'users' && canManageUsers && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-600">User management features are available in mock mode.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && canManageUsers && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">System Settings</h3>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-600">System configuration options will be available here.</p>
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