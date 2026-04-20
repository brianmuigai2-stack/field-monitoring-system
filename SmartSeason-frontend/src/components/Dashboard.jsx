import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3,
  Leaf
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isAgent } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/fields/stats/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error: {error}
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value || 0}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Admin Dashboard' : 'Field Agent Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.username}!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-sm text-gray-600">SmartSeason</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fields"
          value={stats?.total_fields}
          icon={Sprout}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Active Fields"
          value={stats?.active_fields}
          icon={TrendingUp}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="At Risk"
          value={stats?.at_risk_fields}
          icon={AlertTriangle}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          title="Completed"
          value={stats?.completed_fields}
          icon={CheckCircle}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Field Stages Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Field Stages Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{stats?.planted_fields || 0}</div>
            <div className="text-sm text-yellow-600 mt-1">Planted</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats?.growing_fields || 0}</div>
            <div className="text-sm text-green-600 mt-1">Growing</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{stats?.ready_fields || 0}</div>
            <div className="text-sm text-blue-600 mt-1">Ready</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-700">{stats?.harvested_fields || 0}</div>
            <div className="text-sm text-emerald-600 mt-1">Harvested</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isAdmin && (
            <button onClick={() => navigate('/fields')} className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer">
              <Sprout className="h-5 w-5 mr-2" />
              Create New Field
            </button>
          )}
          <button onClick={() => navigate('/fields')} className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer">
            <BarChart3 className="h-5 w-5 mr-2" />
            View All Fields
          </button>
          {isAdmin && (
            <button onClick={() => navigate('/agents')} className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer">
              <Users className="h-5 w-5 mr-2" />
              Manage Agents
            </button>
          )}
          <button onClick={() => navigate('/fields')} className="flex items-center justify-center p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 cursor-pointer">
            <AlertTriangle className="h-5 w-5 mr-2" />
            At Risk Fields
          </button>
          <button onClick={() => navigate('/updates')} className="flex items-center justify-center p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 cursor-pointer">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Updates
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Summary</h2>
        <div className="space-y-3">
          {stats?.at_risk_fields > 0 && (
            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-orange-800">Fields requiring attention</span>
              </div>
              <span className="font-semibold text-orange-600">{stats.at_risk_fields}</span>
            </div>
          )}
          {stats?.active_fields > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-blue-800">Fields in active growth</span>
              </div>
              <span className="font-semibold text-blue-600">{stats.active_fields}</span>
            </div>
          )}
          {stats?.completed_fields > 0 && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                <span className="text-emerald-800">Fields successfully harvested</span>
              </div>
              <span className="font-semibold text-emerald-600">{stats.completed_fields}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
