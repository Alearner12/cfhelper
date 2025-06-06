import { useState } from 'react';
import { User, LogIn, AlertCircle } from 'lucide-react';

const UserLogin = ({ onLogin, currentUser, onLogout }) => {
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handle.trim()) {
      setError('Please enter a valid Codeforces handle');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onLogin(handle.trim());
    } catch (err) {
      setError(err.message || 'Failed to load user data. Please check the handle and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setHandle('');
    setError('');
    onLogout();
  };

  if (currentUser) {
    return (
      <div className="card text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-codeforces-blue rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Welcome, {currentUser.handle}!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentUser.firstName} {currentUser.lastName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-codeforces-blue">
              {currentUser.rating || 'Unrated'}
            </div>
            <div className="text-xs text-gray-500">Current Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {currentUser.maxRating || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">Max Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {currentUser.rank || 'Unranked'}
            </div>
            <div className="text-xs text-gray-500">Rank</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-secondary w-full"
        >
          Switch User
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-codeforces-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Login to Your Profile
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your Codeforces handle to view your stats and progress
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Codeforces Handle
          </label>
          <input
            type="text"
            value={handle}
            onChange={(e) => {
              setHandle(e.target.value);
              setError('');
            }}
            placeholder="e.g., tourist, jiangly, Um_nik"
            className="input-field"
            disabled={isLoading}
            required
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !handle.trim()}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <LogIn size={16} />
              <span>Load Profile</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-600 dark:text-blue-400">
          <strong>Note:</strong> This is not a real login. We just fetch your public Codeforces data to show your stats and progress.
        </p>
      </div>
    </div>
  );
};

export default UserLogin; 