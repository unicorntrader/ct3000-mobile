import React from 'react';
import { useTradingState } from './hooks/useTradingState';
import { Dashboard } from './components/views';
import { DesktopAdapter } from './components/adapters';

function TradingJournal() {
  const tradingState = useTradingState();

  return (
    <DesktopAdapter {...tradingState}>
      {(props) => <Dashboard {...props} />}
    </DesktopAdapter>
  );
}

export default TradingJournal;
