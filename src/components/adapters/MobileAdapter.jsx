import React from 'react';
import { BarChart3, Menu, X, Home, Target, BookOpen, TrendingUp, User, Settings, LogOut, Brain, Calendar } from 'lucide-react';

export const UnifiedAdapter = ({ children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [profileSidebarOpen, setProfileSidebarOpen] = React.useState(false);
  
  // Enhanced navigation with Intelligence included
  const navItems = [
    { id: 'dashboard', name: 'Home', icon: Home, shortName: 'Home' },
    { id: 'plans', name: 'Plans', icon: Target, shortName: 'Plans' },
    { id: 'trades', name: 'Trades', icon: BarChart3, shortName: 'Trades' },
    { id: 'intelligence', name: 'Intelligence', icon: Brain, shortName: 'AI' },
    { id: 'journal', name: 'Notes', icon: BookOpen, shortName: 'Notes' },
    { id: 'performance', name: 'Performance', icon: TrendingUp, shortName: 'Stats' }
  ];

  const profileItems = [
    { name: 'Settings', icon: Settings },
    { name: 'Account', icon: User },
    { name: 'Logout', icon: LogOut }
  ];

  const unifiedProps = {
    ...props,
    activeTab,
    setActiveTab,
    profileSidebarOpen,
    setProfileSidebarOpen,
    navItems,
    isMobile: true // Keep mobile-first mindset
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header - Works on all screen sizes */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 lg:px-8 py-3">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">CT3000</h1>
              <p className="hidden lg:block text-sm text-gray-600">Trading Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Current Date - Hidden on small screens */}
            <div className="hidden md:block text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            
            {/* Profile/Menu Button */}
            <button
              onClick={() => setProfileSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* User Profile Sidebar - Enhanced for desktop */}
      {profileSidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setProfileSidebarOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 lg:w-96 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button 
                onClick={() => setProfileSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Profile Info */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">John Trader</h3>
                  <p className="text-sm text-gray-500">john@example.com</p>
                  <p className="text-xs text-gray-400 mt-1">Active since July 2025</p>
                </div>
              </div>
            </div>

            {/* Quick Stats - Desktop Enhancement */}
            <div className="p-6 border-b bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">72%</p>
                  <p className="text-xs text-gray-500">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">+$2,847</p>
                  <p className="text-xs text-gray-500">This Month</p>
                </div>
              </div>
            </div>

            {/* Profile Options */}
            <nav className="p-6">
              {profileItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      console.log(`${item.name} clicked`);
                      setProfileSidebarOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors text-gray-700 hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop-only sections */}
            <div className="hidden lg:block p-6 border-t">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">CT3000 Trading Journal</p>
                <p className="text-xs text-gray-400">Version 1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20 lg:pb-8 px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {children(unifiedProps)}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
        <div className="flex">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                  activeTab === item.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.shortName}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
