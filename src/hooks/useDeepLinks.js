// src/hooks/useDeepLinks.js
import { useState, useEffect } from 'react';

export const useDeepLinks = () => {
  const [deepLinkParams, setDeepLinkParams] = useState({
    filter: null,
    highlight: null,
    module: null,
    utm_source: null,
    auto_applied: false
  });

  useEffect(() => {
    // Parse URL parameters from window.location
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    
    // Extract parameters
    const params = {
      filter: urlParams.get('filter'),
      highlight: urlParams.get('highlight'), 
      symbol: urlParams.get('symbol'),
      session: urlParams.get('session'),
      outcome: urlParams.get('outcome'),
      utm_source: urlParams.get('utm_source'),
      auto_applied: false
    };

    // Extract module from hash (e.g., #/performance)
    if (hash) {
      const moduleMatch = hash.match(/#\/(\w+)/);
      params.module = moduleMatch ? moduleMatch[1] : null;
    }

    setDeepLinkParams(params);
  }, []);

  const shouldAutoApply = () => {
    return deepLinkParams.filter && !deepLinkParams.auto_applied;
  };

  const markAsApplied = () => {
    setDeepLinkParams(prev => ({ ...prev, auto_applied: true }));
  };

  return {
    deepLinkParams,
    shouldAutoApply,
    markAsApplied,
    isFromEmail: deepLinkParams.utm_source === 'weekly_email'
  };
};
