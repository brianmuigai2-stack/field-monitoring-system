import { useState } from 'react';
import { Leaf, Sprout, Users, BarChart3, AlertTriangle, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SmartSeason</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-green-600 transition">How It Works</a>
              <button onClick={() => setShowLoginModal(true)} className="text-gray-600 hover:text-green-600 transition">Sign In</button>
              <button onClick={() => setShowLoginModal(true)} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600">Features</a>
              <a href="#how-it-works" className="block text-gray-600">How It Works</a>
              <button onClick={() => setShowLoginModal(true)} className="block text-gray-600">Sign In</button>
              <button onClick={() => setShowLoginModal(true)} className="block bg-green-600 text-white px-5 py-2 rounded-lg text-center">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
                Field Monitoring Made Simple
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Track Your Crops
                <span className="text-green-600"> Smartly</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Monitor crop progress across multiple fields during growing seasons. 
                Empower your field agents and make data-driven decisions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowLoginModal(true)} className="flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition text-lg font-medium">
                  Start Monitoring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <a href="#features" className="flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition text-lg font-medium">
                  Learn More
                </a>
              </div>
              <div className="mt-10 flex items-center space-x-8">
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-gray-500">Fields Tracked</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">50+</p>
                  <p className="text-gray-500">Field Agents</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">99%</p>
                  <p className="text-gray-500">Uptime</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Leaf className="h-8 w-8 text-green-600" />
                      <span className="ml-2 font-semibold text-gray-900">Dashboard</span>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Live</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">24</p>
                      <p className="text-sm text-gray-500">Active</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-orange-500">8</p>
                      <p className="text-sm text-gray-500">At Risk</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-500">12</p>
                      <p className="text-sm text-gray-500">Completed</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center">
                        <Sprout className="h-5 w-5 text-green-500" />
                        <span className="ml-2 text-gray-700">North Field</span>
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Growing</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center">
                        <Sprout className="h-5 w-5 text-blue-500" />
                        <span className="ml-2 text-gray-700">South Field</span>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Ready</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center">
                        <Sprout className="h-5 w-5 text-orange-500" />
                        <span className="ml-2 text-gray-700">East Field</span>
                      </div>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">At Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Everything You Need</h2>
            <p className="mt-4 text-xl text-gray-600">Powerful features to manage your fields effectively</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Sprout className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Field Management</h3>
              <p className="text-gray-600">Create, organize, and manage all your fields in one place. Track crop types, planting dates, and growth stages.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600">Assign fields to field agents and enable seamless communication for real-time updates.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">Get comprehensive insights with visual dashboards showing field status and performance metrics.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <AlertTriangle className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk Detection</h3>
              <p className="text-gray-600">Automatic alerts when fields are at risk based on growth timelines and stage progression.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Stage Tracking</h3>
              <p className="text-gray-600">Monitor fields through growth stages: Planted → Growing → Ready → Harvested.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Update History</h3>
              <p className="text-gray-600">Keep a complete record of all field updates with notes and timestamps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Fields</h3>
              <p className="text-gray-600">Add your agricultural fields with crop details and planting dates.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Assign Agents</h3>
              <p className="text-gray-600">Assign fields to your field agents for monitoring and updates.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Monitor Progress</h3>
              <p className="text-gray-600">Track growth stages and receive alerts for fields that need attention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Field Management?</h2>
          <p className="text-xl text-green-100 mb-8">Join hundreds of farmers and agricultural coordinators already using SmartSeason.</p>
          <button onClick={() => setShowLoginModal(true)} className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg font-medium">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Leaf className="h-6 w-6 text-green-500" />
              <span className="ml-2 text-lg font-bold text-white">SmartSeason</span>
            </div>
            <p className="text-gray-400 text-sm">© 2026 SmartSeason. Built for modern agriculture.</p>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Landing;