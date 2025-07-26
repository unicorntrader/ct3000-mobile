import React from 'react';
import { useTradingState } from './hooks/useTradingState';
import { Dashboard, PlanTrader, SmartJournal, Notes } from './components/views';
import { DesktopAdapter, MobileAdapter } from './components/adapters';
import { useIsMobile } from './hooks/useIsMobile';

function AppRouter() {
  const tradingState = useTradingState();
  const isMobile = useIsMobile();

  const renderActiveModule = (props) => {
    const moduleProps = { ...tradingState, ...props };
    
    switch (props.activeTab || tradingState.activeModule) {
      case 'dashboard':
        return <Dashboard {...moduleProps} />;
      case 'plans':
      case 'plan-trader':
        return <PlanTrader {...moduleProps} />;
      case 'journal':
      case 'notebook':
        case 'journal':
case 'notebook':
  return <Notes {...moduleProps} />;    // ← Use Notes instead of Journal
      case 'trades':
      case 'smart-journal':
        return <div className="p-8 text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Smart Journal</h2>
          <p>Coming Soon</p>
        </div>;
      case 'performance':
      case 'daily-view':
        return <div className="p-8 text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Performance</h2>
          <p>Coming Soon</p>
        </div>;
      default:
        return <Dashboard {...moduleProps} />;
    }
  };

  if (isMobile) {
    return (
      <MobileAdapter {...tradingState}>
        {(props) => renderActiveModule(props)}
      </MobileAdapter>
    );
  }

  return (
    <DesktopAdapter {...tradingState}>
      {() => renderActiveModule(tradingState)}
    </DesktopAdapter>
  );
}

export default AppRouter;
