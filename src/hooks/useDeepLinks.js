// src/hooks/useDeepLinks.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDeepLinks = () => {
  const location = useLocation();
  const [deepLinkParams, setDeepLinkParams] = useState({
    filter: null,
    highlight: null,
    module: null,
    date: null,
    symbol: null,
    utm_source: null,
    auto_applied: false
  });

  useEffect(() => {
    // Parse URL parameters on mount and location change
    const urlParams = new URLSearchParams(location.search);
    const hash = location.hash;
    
    // Extract parameters
    const params = {
      filter: urlParams.get('filter'),
      highlight: urlParams.get('highlight'), 
      date: urlParams.get('date'),
      symbol: urlParams.get('symbol'),
      session: urlParams.get('session'), // morning, midday, afternoon
      outcome: urlParams.get('outcome'), // wins, losses
      timeframe: urlParams.get('timeframe'), // week, month
      utm_source: urlParams.get('utm_source'),
      utm_campaign: urlParams.get('utm_campaign'),
      insight_id: urlParams.get('insight_id')
    };

    // Extract module from hash (e.g., #/performance)
    if (hash) {
      const moduleMatch = hash.match(/#\/(\w+)/);
      params.module = moduleMatch ? moduleMatch[1] : null;
    }

    setDeepLinkParams({
      ...params,
      auto_applied: false // Reset auto-apply flag
    });

    // Track email clicks for analytics
    if (params.utm_source === 'weekly_email') {
      console.log('📧 Email click tracked:', {
        campaign: params.utm_campaign,
        module: params.module,
        filter: params.filter,
        insight_id: params.insight_id
      });
    }

  }, [location]);

  // Mark parameters as applied to prevent re-triggering
  const markAsApplied = () => {
    setDeepLinkParams(prev => ({ ...prev, auto_applied: true }));
  };

  // Check if we should auto-apply filters
  const shouldAutoApply = () => {
    return deepLinkParams.filter && !deepLinkParams.auto_applied;
  };

  // Get filter configuration for different modules
  const getFilterConfig = () => {
    const { filter, highlight, symbol, session, outcome, date, timeframe } = deepLinkParams;

    switch (filter) {
      case 'symbol':
        return {
          type: 'symbol',
          value: highlight || symbol,
          description: `Showing ${highlight || symbol} trades`
        };
        
      case 'time-analysis':
        return {
          type: 'session',
          value: session || 'all',
          description: `Analyzing ${session || 'all'} trading sessions`
        };
        
      case 'outcome':
        return {
          type: 'outcome', 
          value: outcome || highlight,
          description: `Showing ${outcome || highlight} trades`
        };
        
      case 'date':
        return {
          type: 'date',
          value: date || highlight,
          description: `Showing trades for ${date || highlight}`
        };
        
      case 'size-analysis':
        return {
          type: 'position-size',
          value: highlight, // large, medium, small
          description: `Analyzing ${highlight} position sizes`
        };
        
      case 'weekly-performance':
        return {
          type: 'timeframe',
          value: 'week',
          description: 'Showing weekly performance'
        };
        
      case 'strategy-tags':
        return {
          type: 'strategy',
          value: highlight,
          description: `Showing ${highlight} strategy trades`
        };
        
      default:
        return null;
    }
  };

  // Generate URL for sharing
  const generateShareUrl = (module, filterType, value, description) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    
    params.set('filter', filterType);
    params.set('highlight', value);
    params.set('utm_source', 'app_share');
    params.set('utm_campaign', 'user_generated');
    
    return `${baseUrl}/#/${module}?${params.toString()}`;
  };

  return {
    deepLinkParams,
    shouldAutoApply,
    markAsApplied,
    getFilterConfig,
    generateShareUrl,
    isFromEmail: deepLinkParams.utm_source === 'weekly_email'
  };
};
