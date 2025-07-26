import React from 'react';
import {
  DollarSign,
  Target,
  TrendingUp,
  Activity,
  Plus,
  Edit3,
  Calendar,
  BarChart3
} from 'lucide-react';

export const Dashboard = (props) => {
  const { isMobile } = props;

  const metrics = [
    { title: 'Active Plans', value: '12', trend: '+3 Today', color: 'blue', onClick: () => {} },
    { title: 'Total P&L', value: '$4,530', trend: '+2.1%', color: 'green', onClick: () => {} },
    { title: 'Win Rate', value: '68%', trend: 'vs 52%', color: 'purple', onClick: () => {} },
    { title: "Today's Trades", value: '5', trend: '3 winners', color: 'orange', onClick: () => {} },
  ];

  if (isMobile) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>CT3000 Mobile Dashboard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {metrics.map(metric => (
            <div
              key={metric.title}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '1rem',
                cursor: 'pointer',
              }}
              onClick={metric.onClick}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{metric.title}</p>
                <MetricIcon title={metric.title} color={metric.color} />
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>{metric.value}</p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>{metric.trend}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>CT3000 Desktop Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {metrics.map(metric => (
          <div
            key={metric.title}
            style={{
              backgroundColor: 'white',
              borderLeft: `4px solid ${getColor(metric.color)}`,
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              padding: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={metric.onClick}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4B5563' }}>{metric.title}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{metric.value}</p>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>{metric.trend}</p>
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

  switch (title) {
    case 'Active Plans':
      return <Target color={iconColor} size={24} />;
    case 'Total P&L':
      return <DollarSign color={iconColor} size={24} />;
    case 'Win Rate':
      return <TrendingUp color={iconColor} size={24} />;
    case "Today's Trades":
      return <Activity color={iconColor} size={24} />;
    default:
      return <BarChart3 color={iconColor} size={24} />;
  }
};

const getColor = (color) => {
  switch (color) {
    case 'blue':
      return '#3B82F6';
    case 'green':
      return '#10B981';
    case 'purple':
      return '#8B5CF6';
    case 'orange':
      return '#F97316';
    default:
      return '#6B7280';
  }
};
