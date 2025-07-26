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
        return <div className="p-8 text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Smart Journal</h2>
          <p>Coming Soon</p>
        </div>;
      case 'daily-view':
        return <div className="p-8 text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Daily View</h2>
          <p>Coming Soon</p>
        </div>;
      case 'performance':
        return <div className="p-8 text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Performance</h2>
          <p>Coming Soon</p>
        </div>;
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
