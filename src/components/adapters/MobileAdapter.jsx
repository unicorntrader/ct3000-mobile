import React from 'react';
import { BarChart3, Menu, X, Home, Target, BookOpen, TrendingUp, User, Settings, LogOut } from 'lucide-react';

export const MobileAdapter = ({ children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [profileSidebarOpen, setProfileSidebarOpen] = React.useState(false);
  
  const navItems = [
    { id: 'dashboard', name: 'Home', icon: Home },
    { id: 'plans', name: 'Plans', icon: Target },
    { id: 'trades', name: 'Trades', icon: BarChart3 },
    { id: 'journal', name: 'Notes', icon: BookOpen },
    { id: 'performance', name: 'Stats', icon: TrendingUp }
  ];

  const profileItems = [
    { name: 'Settings', icon: Settings },
    { name: 'Account', icon: User },
    { name: 'Logout', icon: LogOut }
  ];

  const mobileProps = {
    ...props,
    activeTab,
    setActiveTab,
    profileSidebarOpen,
    setProfileSidebarOpen,
    navItems,
    isMobile: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">CT3000</h1>
          </div>
          <button
            onClick={() => setProfileSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* User Profile Sidebar */}
      {profileSidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setProfileSidebarOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button onClick={() => setProfileSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Profile Info */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">John Trader</h3>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
              </div>
            </div>

            {/* Profile Options */}
            <nav className="p-4">
              {profileItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      // Handle profile actions here
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
          </div>
        </div>
      )}

      <main className="pb-20">
        {children(mobileProps)}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
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
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
