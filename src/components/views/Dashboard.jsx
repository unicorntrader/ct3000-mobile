import React from 'react';
import {
  DollarSign,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Plus,
  Edit3,
  PieChart
} from 'lucide-react';

export const Dashboard = (props) => {
  const { tradePlans, trades, isMobile, handleModuleChange, setActiveTab } = props;

  // Calculate metrics from actual data
  const activePlans = tradePlans.filter(p => p.status === 'planned');
  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winningTrades = trades.filter(t => t.outcome === 'win');
  const winRate = trades.length > 0 ? ((winningTrades.length / trades.length) * 100).toFixed(0) : 0;
  
  // Calculate adherence score (simplified version based on plan execution)
  const executedPlans = tradePlans.filter(p => p.status === 'executed').length;
  const planAdherence = tradePlans.length > 0 ? Math.round((executedPlans / tradePlans.length) * 100) : 0;
  // In real app, this would factor in: entry timing, exit discipline, position sizing, stop loss adherence
  const adherenceScore = Math.max(60, planAdherence + Math.random() * 20); // Mock realistic score

  const metrics = [
    { 
      title: 'This Week P&L', 
      value: `${totalPnL >= 0 ? '+' : ''}$${Math.abs(totalPnL).toLocaleString()}`, 
      color: totalPnL >= 0 ? 'text-green-600' : 'text-red-600',
      icon: DollarSign,
      insight: `${trades.length} trades total`,
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('performance');
        } else if (handleModuleChange) {
          handleModuleChange('performance');
        }
      }
    },
    { 
      title: 'Active Plans', 
      value: activePlans.length.toString(), 
      color: 'text-blue-600',
      icon: Target,
      insight: `${activePlans.length} setups ready`,
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('plans');
        } else if (handleModuleChange) {
          handleModuleChange('plan-trader');
        }
      }
    },
    { 
      title: "Risk per Trade", 
      value: trades.length > 0 ? `${Math.round(Math.abs(totalPnL) / trades.length)}` : '$0', 
      color: 'text-orange-600',
      icon: Activity,
      insight: `avg per position`,
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('trades');
        } else if (handleModuleChange) {
          handleModuleChange('smart-journal');
        }
      }
    },
    { 
      title: 'Win Rate', 
      value: `${winRate}%`, 
      color: parseInt(winRate) >= 60 ? 'text-green-600' : parseInt(winRate) >= 40 ? 'text-yellow-600' : 'text-red-600',
      icon: TrendingUp,
      insight: `${winningTrades.length}/${trades.length} wins`,
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('performance');
        } else if (handleModuleChange) {
          handleModuleChange('performance');
        }
      }
    },
  ];

  // Recent activity with smart navigation logic
  const recentActivity = [
    { 
      action: 'NVDA plan created', 
      time: '25/07/2025', 
      isClickable: true,
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('plans');
        } else if (handleModuleChange) {
          handleModuleChange('plan-trader');
        }
      }
    },
    { 
      action: 'Daily note added', 
      time: '24/07/2025', 
      isClickable: true,
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('journal');
        } else if (handleModuleChange) {
          handleModuleChange('notebook');
        }
      }
    },
    { 
      action: 'AAPL plan deleted', 
      time: '24/07/2025', 
      isClickable: false, // Don't navigate to deleted items
      onClick: null
    },
    { 
      action: 'Note updated', 
      time: '23/07/2025', 
      isClickable: true,
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('journal');
        } else if (handleModuleChange) {
          handleModuleChange('notebook');
        }
      }
    },
    { 
      action: 'SPY plan created', 
      time: '23/07/2025', 
      isClickable: true,
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('plans');
        } else if (handleModuleChange) {
          handleModuleChange('plan-trader');
        }
      }
    }
  ];

  // Quick shortcuts with working navigation
  const shortcuts = [
    { 
      title: 'New Plan', 
      icon: Plus, 
      color: 'text-blue-600',
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('plans');
        } else if (handleModuleChange) {
          handleModuleChange('plan-trader');
        }
      }
    },
    { 
      title: 'Add Note', 
      icon: Edit3, 
      color: 'text-purple-600',
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('journal');
        } else if (handleModuleChange) {
          handleModuleChange('notebook');
        }
      }
    },
    { 
      title: 'Past Trades', 
      icon: BarChart3, 
      color: 'text-green-600',
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('trades');
        } else if (handleModuleChange) {
          handleModuleChange('smart-journal');
        }
      }
    },
    { 
      title: 'Review Stats', 
      icon: PieChart, 
      color: 'text-orange-600',
      onClick: () => {
        if (isMobile && setActiveTab) {
          setActiveTab('performance');
        } else if (handleModuleChange) {
          handleModuleChange('performance');
        }
      }
    }
  ];

  if (isMobile) {
    return (
      <div className="p-4 min-h-screen">
        {/* Performance Cards with better context */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={metric.onClick}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.insight}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions - Moved up for better flow */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {shortcuts.map((shortcut, index) => {
            const Icon = shortcut.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={shortcut.onClick}
              >
                <Icon className={`h-6 w-6 ${shortcut.color}`} />
                <span className="font-medium text-gray-900">{shortcut.title}</span>
              </div>
            );
          })}
        </div>

        {/* Recent Activity with smart navigation */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Activity</h3>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center p-4 transition-colors ${
                  activity.isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
                } ${
                  index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''
                }`}
                onClick={activity.isClickable ? activity.onClick : undefined}
              >
                <div>
                  <p className={`font-medium ${activity.isClickable ? 'text-gray-900' : 'text-gray-500'}`}>
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                {activity.isClickable && <div className="text-blue-600 text-sm">→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      {/* Desktop Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4"
              style={{ borderLeftColor: metric.color.includes('green') ? '#10B981' : metric.color.includes('blue') ? '#3B82F6' : metric.color.includes('purple') ? '#8B5CF6' : '#F97316' }}
              onClick={metric.onClick}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${metric.color}`}>{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.insight}</p>
                </div>
                <Icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity - Desktop */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0 transition-colors rounded ${
                  activity.isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
                }`}
                onClick={activity.isClickable ? activity.onClick : undefined}
              >
                <div>
                  <p className={`font-medium ${activity.isClickable ? 'text-gray-900' : 'text-gray-500'}`}>
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                {activity.isClickable && <div className="text-blue-600 text-sm">→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts - Desktop */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => {
              const Icon = shortcut.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={shortcut.onClick}
                >
                  <Icon className={`h-6 w-6 ${shortcut.color}`} />
                  <span className="font-medium text-gray-900">{shortcut.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
