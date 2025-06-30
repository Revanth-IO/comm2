import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Settings, Shield, Plus, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginPrompt from './LoginPrompt';

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout, hasPermission } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Force re-render when authentication state changes
  const [renderKey, setRenderKey] = useState(0);
  
  useEffect(() => {
    setRenderKey(prev => prev + 1);
    console.log('👤 UserMenu re-rendered:', { 
      user: user ? { name: user.name, email: user.email, role: user.role } : null, 
      isAuthenticated, 
      userRole: user?.role,
      canManageRoles: hasPermission('manage_roles'),
      canApproveContent: hasPermission('approve_content'),
      renderKey
    });
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    console.log('🚪 Logout clicked');
    logout();
    setShowMenu(false);
  };

  const handleMenuItemClick = (action: string) => {
    console.log('📱 Menu item clicked:', action);
    setShowMenu(false);
    // In a real app, you would navigate to the appropriate page here
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Show loading state
  if (!isAuthenticated && !user) {
    return (
      <>
        <button
          onClick={() => setShowLoginPrompt(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 transform hover:scale-105"
        >
          <User className="w-4 h-4" />
          <span>Sign In</span>
        </button>
        
        <LoginPrompt 
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
        />
      </>
    );
  }

  // Show authenticated user menu
  return (
    <div className="relative" ref={menuRef} key={renderKey}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user?.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
          <div className="text-xs text-gray-500 capitalize flex items-center space-x-2">
            <span>{user?.role.replace('_', ' ')}</span>
            {user?.role === 'admin' && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            )}
            {user?.role === 'moderator' && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">
                Mod
              </span>
            )}
          </div>
        </div>
      </button>

      {showMenu && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-900">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-orange-600 font-medium capitalize">
                {user?.role.replace('_', ' ')} Account
              </span>
              {user?.role === 'admin' && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                  ADMIN
                </span>
              )}
              {user?.role === 'moderator' && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                  MOD
                </span>
              )}
            </div>
          </div>

          <div className="py-2">
            <button 
              onClick={() => handleMenuItemClick('profile')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>

            {hasPermission('add_classified') && (
              <button 
                onClick={() => handleMenuItemClick('listings')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>My Listings</span>
              </button>
            )}

            {hasPermission('approve_content') && (
              <button 
                onClick={() => handleMenuItemClick('content-review')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Content Review</span>
                <span className="ml-auto bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                  MOD
                </span>
              </button>
            )}

            {hasPermission('manage_roles') && (
              <button 
                onClick={() => handleMenuItemClick('admin-panel')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
                <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                  ADMIN
                </span>
              </button>
            )}

            <button 
              onClick={() => handleMenuItemClick('settings')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          <div className="border-t border-gray-200 py-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;