import React from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import { useTradingState } from './hooks/useTradingState';

// Shared logic components
import { DashboardLogic, PlanTraderLogic } from './components/shared';

// Shared view components  
import { Dashboard, PlanTrader, Journal } from './components/views';

// Presentation adapters
import { MobileAdapter, DesktopAdapter } from './components/adapters';

function TradingJournal() {
  const isMobile = useIsMobile();
  const tradingState = useTradingState();

  // Route content based on active module
  const renderContent = (props) => {
    const { activeModule, activeTab } = props;
    const currentModule = isMobile ? activeTab : activeModule;

    switch (currentModule) {
      case 'dashboard':
        return (
          <DashboardLogic {...props}>
            {(dashboardProps) => <Dashboard {...dashboardProps} />}
          </DashboardLogic>
        );
        
      case 'plans':
      case 'plan-trader':
        return (
          <PlanTraderLogic {...props}>
            {(planProps) => <PlanTrader {...planProps} />}
          </PlanTraderLogic>
        );
        
      case 'journal':
      case 'notebook':
        return <Journal {...props} />;
        
      default:
        return (
          <DashboardLogic {...props}>
            {(dashboardProps) => <Dashboard {...dashboardProps} />}
          </DashboardLogic>
        );
    }
  };

  // Choose presentation layer based on device
  const PresentationAdapter = isMobile ? MobileAdapter : DesktopAdapter;

  return (
    <PresentationAdapter {...tradingState}>
      {(adapterProps) => renderContent(adapterProps)}
    </PresentationAdapter>
  );
}

export default TradingJournal;