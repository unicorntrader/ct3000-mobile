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
  const { metrics, quickActions, recentPlans, recentActivities, isMobile } = props;

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
      {/* Desktop layout content to be added */}
    </div>
  );
};

const MetricIcon = ({ title, color, className = "h-6 w-6" }) => {
  const iconColor = '#2563EB'; // fallback blue
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
