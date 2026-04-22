import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Sprout, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  User,
  MapPin
} from 'lucide-react';

const Fields = () => {
  const { user, isAdmin } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    crop_type: '',
    planting_date: '',
    current_stage: 'planted',
    assigned_agent_id: ''
  });

  useEffect(() => {
    fetchFields();
    if (isAdmin) {
      fetchAgents();
    }
  }, []);

  const fetchFields = async () => {
    try {
      const response = await api.get('/fields');
      setFields(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await api.get('/users/agents');
      setAgents(response.data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEditModal) {
        await api.put(`/fields/${selectedField.id}`, formData);
      } else {
        await api.post('/fields', formData);
      }
      
      await fetchFields();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save field');
    }
  };

  const handleDelete = async (fieldId) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    
    try {
      await api.delete(`/fields/${fieldId}`);
      await fetchFields();
    } catch (err) {
      setError(err.message || 'Failed to delete field');
    }
  };

  const handleEdit = (field) => {
    setSelectedField(field);
    const plantingDate = field.planting_date 
      ? new Date(field.planting_date).toISOString().split('T')[0]
      : '';
    setFormData({
      name: field.name,
      crop_type: field.crop_type,
      planting_date: plantingDate,
      current_stage: field.current_stage,
      assigned_agent_id: field.assigned_agent_id || ''
    });
    setShowEditModal(true);
  };

  const handleView = (field) => {
    setSelectedField(field);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedField(null);
    setFormData({
      name: '',
      crop_type: '',
      planting_date: '',
      current_stage: 'planted',
      assigned_agent_id: ''
    });
    setError('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'at_risk':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      default:
        return <Sprout className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'at_risk':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Field Management</h1>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Field
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
                  Field Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planting Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{field.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {field.crop_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(field.planting_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(field.current_stage)}`}>
                      {field.current_stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(field.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(field.status)}`}>
                        {field.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-1" />
                      {field.agent_name || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(field)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEdit(field)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(field.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {showEditModal ? 'Edit Field' : 'Create New Field'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Type
                </label>
                <input
                  type="text"
                  value={formData.crop_type}
                  onChange={(e) => setFormData({...formData, crop_type: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planting Date
                </label>
                <input
                  type="date"
                  value={formData.planting_date}
                  onChange={(e) => setFormData({...formData, planting_date: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stage
                </label>
                <select
                  value={formData.current_stage}
                  onChange={(e) => setFormData({...formData, current_stage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="ready">Ready</option>
                  <option value="harvested">Harvested</option>
                </select>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Agent
                  </label>
                  <select
                    value={formData.assigned_agent_id}
                    onChange={(e) => setFormData({...formData, assigned_agent_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  {showEditModal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Field Details</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Field Name:</span>
                <p className="text-gray-900">{selectedField.name}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Crop Type:</span>
                <p className="text-gray-900">{selectedField.crop_type}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Planting Date:</span>
                <p className="text-gray-900">{new Date(selectedField.planting_date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Current Stage:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(selectedField.current_stage)}`}>
                  {selectedField.current_stage}
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <div className="flex items-center mt-1">
                  {getStatusIcon(selectedField.status)}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedField.status)}`}>
                    {selectedField.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Assigned Agent:</span>
                <p className="text-gray-900">{selectedField.agent_name || 'Unassigned'}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fields;
