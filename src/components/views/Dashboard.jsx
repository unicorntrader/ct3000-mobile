import React from 'react';
import {
  DollarSign,
  Target,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';

export const Dashboard = (props) => {
  const { tradePlans, trades, isMobile } = props;

  // Calculate metrics from actual data
  const activePlans = tradePlans.filter(p => p.status === 'planned');
  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winningTrades = trades.filter(t => t.outcome === 'win');
  const winRate = trades.length > 0 ? ((winningTrades.length / trades.length) * 100).toFixed(0) : 0;
  
  const today = new Date().toISOString().split('T')[0];
  const todayTrades = trades.filter(t => 
    t.timestamp && t.timestamp.startsWith(today)
  );
  const todayWinners = todayTrades.filter(t => t.outcome === 'win');

  const metrics = [
    { 
      title: 'Active Plans', 
      value: activePlans.length.toString(), 
      trend: `${activePlans.length} planned`, 
      color: 'blue',
      onClick: () => props.handleModuleChange('plan-trader')
    },
    { 
      title: 'Total P&L', 
      value: `$${totalPnL.toLocaleString()}`, 
      trend: totalPnL >= 0 ? '+2.1%' : '-1.5%', 
      color: totalPnL >= 0 ? 'green' : 'red',
      onClick: () => props.handleModuleChange('performance')
    },
    { 
      title: 'Win Rate', 
      value: `${winRate}%`, 
      trend: `${trades.length} total trades`, 
      color: 'purple',
      onClick: () => props.handleModuleChange('performance')
    },
    { 
      title: "Today's Trades", 
      value: todayTrades.length.toString(), 
      trend: `${todayWinners.length} winners`, 
      color: 'orange',
      onClick: () => props.handleModuleChange('daily-view')
    },
  ];

  if (isMobile) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard</h2>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(metric => (
            <div
              key={metric.title}
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={metric.onClick}
            >
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">{metric.title}</p>
                <MetricIcon title={metric.title} color={metric.color} />
              </div>
              <p className="text-xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.trend}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => (
          <div
            key={metric.title}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4"
            style={{ borderLeftColor: getColor(metric.color) }}
            onClick={metric.onClick}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-sm text-gray-500 mt-1">{metric.trend}</p>
              </div>
              <MetricIcon title={metric.title} color={metric.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricIcon = ({ title, color }) => {
  const iconColor = getColor(color);
  const iconProps = { color: iconColor, size: 24 };

  switch (title) {
    case 'Active Plans':
      return <Target {...iconProps} />;
    case 'Total P&L':
      return <DollarSign {...iconProps} />;
    case 'Win Rate':
      return <TrendingUp {...iconProps} />;
    case "Today's Trades":
      return <Activity {...iconProps} />;
    default:
      return <BarChart3 {...iconProps} />;
  }
};

const getColor = (color) => {
  switch (color) {
    case 'blue':
      return '#3B82F6';
    case 'green':
      return '#10B981';
    case 'red':
      return '#EF4444';
    case 'purple':
      return '#8B5CF6';
    case 'orange':
      return '#F97316';
    default:
      return '#6B7280';
  }
};
