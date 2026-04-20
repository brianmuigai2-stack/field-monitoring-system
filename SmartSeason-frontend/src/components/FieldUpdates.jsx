import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  RefreshCw, 
  Plus, 
  Calendar, 
  User, 
  MapPin, 
  FileText,
  Sprout,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const FieldUpdates = () => {
  const { user, isAdmin } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    field_id: '',
    stage: '',
    notes: ''
  });

  useEffect(() => {
    fetchUpdates();
    fetchFields();
  }, []);

  const fetchUpdates = async () => {
    try {
      const url = isAdmin ? 
        '/api/field-updates/recent' : 
        `/api/fields/updates/agent/${user.id}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch updates');
      }
      
      const data = await response.json();
      setUpdates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFields = async () => {
    try {
      const url = '/api/fields';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFields(data);
      }
    } catch (err) {
      console.error('Failed to fetch fields:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/fields/${formData.field_id}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          stage: formData.stage,
          notes: formData.notes
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update field');
      }
      
      await fetchUpdates();
      await fetchFields();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setFormData({
      field_id: '',
      stage: '',
      notes: ''
    });
    setError('');
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'planted':
        return 'bg-yellow-100 text-yellow-800';
      case 'growing':
        return 'bg-green-100 text-green-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'harvested':
        'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'at_risk':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      default:
        return <Sprout className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Field Updates</h1>
        {!isAdmin && (
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Update
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {updates.map((update) => (
                <tr key={update.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{update.field_name}</div>
                        {update.field_status && (
                          <div className="flex items-center mt-1">
                            {getStatusIcon(update.field_status)}
                            <span className="ml-1 text-xs text-gray-500">
                              {update.field_status.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{update.agent_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(update.stage)}`}>
                      {update.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {update.notes ? (
                        <div className="flex items-start">
                          <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <span className="line-clamp-2">{update.notes}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No notes</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(update.update_date).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Field Update</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Field
                </label>
                <select
                  value={formData.field_id}
                  onChange={(e) => setFormData({...formData, field_id: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose a field...</option>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name} - {field.crop_type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select stage...</option>
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="ready">Ready</option>
                  <option value="harvested">Harvested</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any observations or notes..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {updates.length === 0 && !loading && (
        <div className="text-center py-12">
          <RefreshCw className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No field updates</h3>
          <p className="mt-1 text-sm text-gray-500">
            {!isAdmin ? 'Start by adding your first field update.' : 'No field updates have been recorded yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FieldUpdates;
