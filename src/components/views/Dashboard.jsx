import React from 'react';
import { DollarSign, Target, TrendingUp, Activity, Plus, Edit3, Calendar, BarChart3 } from 'lucide-react';

export const Dashboard = (props) => {
  const { metrics, quickActions, recentPlans, recentActivities, isMobile } = props;

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        {/* Mobile Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(metric => (
            <div 
              key={metric.title} 
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow" 
              onClick={metric.onClick}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{metric.title}</p>
                <MetricIcon title={metric.title} color={metric.color} />
              </div>
              <p className={`text-xl font-bold text-${metric.color}-600`}>{metric.value}</p>
              <p className="text-xs text-gray-400 mt-1">{metric.trend}</p>
            </div>
          ))}
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y">
            {recentActivities.map(activity => (
              <div key={activity.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'plan' ? 'bg-blue-500' :
                    activity.type === 'trade' ? 'bg-green-500' :
                    activity.type === 'note' ? 'bg-purple-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.slice(0, 4).map(action => (
            <button
              key={action.id}
              onClick={action.action}
              className={`p-4 rounded-lg ${action.color} text-left transition-colors hover:opacity-80`}
            >
              <ActionIcon id={action.id} className="h-6 w-6 mb-2" />
              <p className="font-medium">{action.title}</p>
              <p className="text-sm opacity-75">{action.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="space-y-6">
      {/* Desktop Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => (
          <div 
            key={metric.title} 
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500" 
            onClick={metric.onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className={`text-2xl font-bold text-${metric.color}-600`}>{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.trend}</p>
              </div>
              <MetricIcon title={metric.title} color={metric.color} className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Desktop Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Plans */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Trade Plans</h3>
          <div className="space-y-3">
            {recentPlans.map(plan => (
              <div key={plan.id} className="p-3 rounded bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{plan.ticker}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      plan.status === 'executed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    ${plan.entry} → ${plan.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'plan' ? 'bg-blue-500' :
                  activity.type === 'trade' ? 'bg-green-500' :
                  activity.type === 'note' ? 'bg-purple-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Desktop */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={action.action}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              <ActionIcon id={action.id} className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">{action.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const MetricIcon = ({ title, color, className = "h-6 w-6" }) => {
  const iconClass = `${className} text-${color}-500`;
  
  switch (title) {
    case 'Active Plans':
      return <Target className={iconClass} />;
    case 'Total P&L':
      return <DollarSign className={iconClass} />;
    case 'Win Rate':
      return <TrendingUp className={iconClass} />;
    case 'Today\'s Trades':
      return <Activity className={iconClass} />;
    default:
      return <BarChart3 className={iconClass} />;
  }
};

const ActionIcon = ({ id, className }) => {
  switch (id) {
    case 'new-plan':
      return <Plus className={className} />;
    case 'add-note':
      return <Edit3 className={className} />;
    case 'daily-view':
      return <Calendar className={className} />;
    case 'performance':
      return <TrendingUp className={className} />;
    default:
      return <Plus className={className} />;
  }
}}
