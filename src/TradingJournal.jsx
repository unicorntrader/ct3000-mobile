import React from 'react';
import { useTradingState } from './hooks/useTradingState';
import { Dashboard, PlanTrader, Journal } from './components/views';
import { DesktopAdapter } from './components/adapters';

function TradingJournal() {
  const tradingState = useTradingState();

  const renderActiveModule = () => {
    switch (tradingState.activeModule) {
      case 'dashboard':
        return <Dashboard {...tradingState} />;
      case 'plan-trader':
        return <PlanTrader {...tradingState} />;
      case 'notebook':
        return <Journal {...tradingState} />;
      case 'smart-journal':
        return <div className="p-6 text-center text-gray-500">Smart Journal - Coming Soon</div>;
      case 'daily-view':
        return <div className="p-6 text-center text-gray-500">Daily View - Coming Soon</div>;
      case 'performance':
        return <div className="p-6 text-center text-gray-500">Performance - Coming Soon</div>;
      default:
        return <Dashboard {...tradingState} />;
    }
  };

  return (
    <DesktopAdapter {...tradingState}>
      {() => renderActiveModule()}
    </DesktopAdapter>
  );
}

export default TradingJournal;
