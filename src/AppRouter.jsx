// Enhanced AppRouter.jsx with Deep Link Routing Support
import React, { useEffect } from 'react';
import { useTradingState } from './hooks/useTradingState';
import { useDeepLinks } from './hooks/useDeepLinks';
import { Dashboard, PlanTrader, SmartJournal, Notes, Performance, DailyView } from './components/views';
import { DesktopAdapter, MobileAdapter } from './components/adapters';
import { useIsMobile } from './hooks/useIsMobile';

function AppRouter() {
  const tradingState = useTradingState();
  const isMobile = useIsMobile();
  const { deepLinkParams, shouldAutoApply } = useDeepLinks();

  // Handle deep link module navigation
  useEffect(() => {
    if (deepLinkParams.module && tradingState.activeModule !== deepLinkParams.module) {
      // Map URL modules to internal module names
      const moduleMapping = {
        'performance': 'performance',
        'smart-journal': 'smart-journal', 
        'trades': 'smart-journal',
        'journal': 'notebook',
        'notes': 'notebook',
        'plans': 'plan-trader',
        'dashboard': 'dashboard',
        'daily': 'daily-view'
      };
      
      const targetModule = moduleMapping[deepLinkParams.module] || deepLinkParams.module;
      tradingState.handleModuleChange(targetModule);
    }
  }, [deepLinkParams.module, tradingState]);

  // Track analytics for deep link usage
  useEffect(() => {
    if (deepLinkParams.utm_source) {
      // Track email engagement
      const analyticsData = {
        source: deepLinkParams.utm_source,
        campaign: deepLinkParams.utm_campaign,
        module: deepLinkParams.module,
        filter: deepLinkParams.filter,
        highlight: deepLinkParams.highlight,
        timestamp: new Date().toISOString()
      };
      
      // In a real app, send to analytics service
      console.log('📊 Deep Link Analytics:', analyticsData);
      
      // You could also store in localStorage for session tracking
      try {
        const existing = JSON.parse(localStorage.getItem('ct3000_deep_links') || '[]');
        existing.push(analyticsData);
        
        // Keep only last 50 entries
        const trimmed = existing.slice(-50);
        localStorage.setItem('ct3000_deep_links', JSON.stringify(trimmed));
      } catch (e) {
        console.warn('Could not store deep link analytics:', e);
      }
    }
  }, [deepLinkParams]);

  const renderActiveModule = (props) => {
    const moduleProps = { 
      ...tradingState, 
      ...props,
      // Pass deep link context to modules
      deepLinkParams,
      isFromDeepLink: shouldAutoApply()
    };
    
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

return <UnifiedAdapter {...tradingState}>{(props) => renderActiveModule(props)}</UnifiedAdapter>


export default AppRouter;
