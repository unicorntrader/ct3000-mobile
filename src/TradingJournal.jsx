function TradingJournal() {
  const tradingState = useTradingState();

  return (
    <DesktopAdapter {...tradingState}>
      {(props) => <Dashboard {...props} />}
    </DesktopAdapter>
  );
}
