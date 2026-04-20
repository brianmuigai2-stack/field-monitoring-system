import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, LogOut } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium text-gray-900">{user?.username}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-900 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
        <p className="text-gray-600">
          SmartSeason Field Monitoring System v1.0.0
        </p>
        <p className="text-sm text-gray-500 mt-2">
          A simple web application for tracking crop progress across multiple fields during a growing season.
        </p>
      </div>
    </div>
  );
};

export default Settings;