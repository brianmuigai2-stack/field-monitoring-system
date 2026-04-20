import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Fields from './components/Fields';
import FieldUpdates from './components/FieldUpdates';
import Users from './components/Users';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedRoute><Layout /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const Layout = () => {
  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 p-8">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fields" element={<Fields />} />
          <Route path="updates" element={<FieldUpdates />} />
          <Route path="agents" element={<Users />} />
          <Route path="analytics" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
