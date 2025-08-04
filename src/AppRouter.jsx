import React from 'react';
import { useTradingState } from './hooks/useTradingState';
import { Dashboard, PlanTrader, SmartJournal, Notes, Performance, DailyView } from './components/views';
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
        return <Notes {...moduleProps} />;
      case 'trades':
      case 'smart-journal':
        return <SmartJournal {...moduleProps} />;
      case 'performance':
        return <Performance {...moduleProps} />;
      case 'daily-view':
        return <DailyView {...moduleProps} />;
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
