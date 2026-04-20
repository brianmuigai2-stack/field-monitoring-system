import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Sprout, 
  RefreshCw, 
  LogOut, 
  User,
  Leaf,
  BarChart3,
  Settings,
  Users
} from 'lucide-react';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path;

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Fields', href: '/fields', icon: Sprout },
    { name: 'Updates', href: '/updates', icon: RefreshCw },
  ];

  const adminNavigation = [
    { name: 'Agents', href: '/agents', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center mb-8 cursor-pointer" onClick={handleHome}>
          <Leaf className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">SmartSeason</h1>
            <p className="text-xs text-gray-500">Field Monitoring</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-600 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Admin
                </p>
                {adminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
