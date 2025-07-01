import React, { useState } from 'react';
import { Database, Upload, Trash2, RefreshCw, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { insertMockData, clearAllData } from '../utils/insertMockData';

interface DatabaseManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DatabaseManager: React.FC<DatabaseManagerProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInsertMockData = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const result = await insertMockData();
      setResult(result);
      console.log('✅ Mock data insertion completed:', result);
    } catch (err) {
      console.error('❌ Mock data insertion failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to insert mock data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear ALL data from the database? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const result = await clearAllData();
      setResult(result);
      console.log('✅ Data clearing completed:', result);
    } catch (err) {
      console.error('❌ Data clearing failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Database Manager</h2>
              <p className="text-sm text-gray-600">Manage Supabase database content</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Display */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Success!</h3>
              </div>
              <p className="text-green-800 mb-3">{result.message}</p>
              {result.counts && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-green-600">{result.counts.categories || 0}</div>
                    <div className="text-xs text-gray-600">Categories</div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">{result.counts.classifieds || 0}</div>
                    <div className="text-xs text-gray-600">Classifieds</div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-purple-600">{result.counts.events || 0}</div>
                    <div className="text-xs text-gray-600">Events</div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-orange-600">{result.counts.businesses || 0}</div>
                    <div className="text-xs text-gray-600">Businesses</div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-pink-600">{result.counts.feedback || 0}</div>
                    <div className="text-xs text-gray-600">Feedback</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Error</h3>
              </div>
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Insert Mock Data</span>
              </h3>
              <p className="text-blue-800 mb-4">
                Populate the database with realistic sample data including classifieds, events, businesses, and categories.
              </p>
              <div className="bg-blue-100 rounded p-3 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">📊 What will be inserted:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 11 Categories (For Sale, Housing, Jobs, Services, etc.)</li>
                  <li>• 10 Classified Ads (mix of approved and pending)</li>
                  <li>• 5 Events (cultural and business events)</li>
                  <li>• 6 Businesses (restaurants, services, retail)</li>
                  <li>• 3 Sample Feedback entries</li>
                </ul>
              </div>
              <button
                onClick={handleInsertMockData}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Inserting Data...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Insert Mock Data</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center space-x-2">
                <Trash2 className="w-5 h-5" />
                <span>Clear All Data</span>
              </h3>
              <p className="text-red-800 mb-4">
                Remove all data from the database. This action cannot be undone and will delete all classifieds, events, businesses, and other content.
              </p>
              <div className="bg-red-100 rounded p-3 mb-4">
                <h4 className="font-medium text-red-900 mb-2">⚠️ Warning:</h4>
                <p className="text-sm text-red-800">
                  This will permanently delete all user-generated content. Only use this for testing or when starting fresh.
                </p>
              </div>
              <button
                onClick={handleClearData}
                disabled={isLoading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Clearing Data...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Data</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">🔧 Environment Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Supabase URL:</span>
                <span className="text-gray-900 font-mono text-xs">
                  {import.meta.env.VITE_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supabase Key:</span>
                <span className="text-gray-900 font-mono text-xs">
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManager;