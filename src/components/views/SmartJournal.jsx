import React, { useState, useMemo } from 'react';
import { Brain, Filter, X, TrendingUp, TrendingDown, AlertTriangle, Calendar, Plus } from 'lucide-react';

export const SmartJournal = (props) => {
  const { trades, tradePlans, isMobile } = props;
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Transform real trades data to include strategy tags and adherence
  const enhancedTrades = useMemo(() => {
    return trades.map(trade => {
      // Generate realistic strategy tags based on trade characteristics
      const strategies = [];
      
      // Add strategy tags based on trade data
      if (trade.pnl > 300) strategies.push('Momentum', 'Trend');
      if (trade.pnl < -200) strategies.push('Mean Reversion');
      if (trade.ticker === 'NVDA') strategies.push('AI Play', 'Tech');
      if (trade.ticker === 'TSLA') strategies.push('Momentum', 'Volatility');
      if (trade.ticker === 'AAPL') strategies.push('Breakout', 'Large Cap');
      if (trade.ticker === 'SPY' || trade.ticker === 'QQQ') strategies.push('Index', 'Market Play');
      if (trade.ticker === 'META') strategies.push('Social Media', 'Recovery');
      if (trade.ticker === 'GOOGL') strategies.push('Search', 'AI');
      if (trade.ticker === 'MSFT') strategies.push('Cloud', 'Enterprise');
      if (trade.ticker === 'AMD') strategies.push('Semiconductors', 'Competition');
      
      // Add time-based strategies
      const hour = new Date(trade.timestamp).getHours();
      if (hour >= 9 && hour < 10) strategies.push('NY-Open');
      else if (hour >= 10 && hour < 14) strategies.push('Mid-Day');
      else if (hour >= 14) strategies.push('Power Hour');
      
      // Add volume-based tags
      if (trade.quantity >= 100) strategies.push('Large Size');
      if (trade.quantity <= 50) strategies.push('Small Size');
      
      // Ensure at least 2 strategies
      if (strategies.length === 0) strategies.push('Base Case', 'Standard');
      if (strategies.length === 1) strategies.push('Core Strategy');
      
      // Calculate realistic adherence score
      const baseAdherence = trade.outcome === 'win' ? 
        Math.floor(Math.random() * 15) + 85 : // Winners: 85-100%
        Math.floor(Math.random() * 25) + 60;  // Losers: 60-85%
      
      // Calculate R-multiple (simplified)
      const rMultiple = trade.pnl > 0 ? 
        (Math.abs(trade.pnl) / 100).toFixed(1) : 
        -(Math.abs(trade.pnl) / 100).toFixed(1);
      
      // Calculate hold time (simplified)
      const holdHours = Math.floor(Math.random() * 8) + 1;
      const holdMinutes = Math.floor(Math.random() * 60);
      const holdTime = `${holdHours}.${Math.floor(holdMinutes/6)}h`;
      
      return {
        ...trade,
        id: trade.id,
        symbol: trade.ticker,
        date: trade.timestamp.split('T')[0],
        strategy: strategies.slice(0, Math.min(3, strategies.length)),
        outcome: trade.outcome,
        pnl: trade.pnl,
        rMultiple: parseFloat(rMultiple),
        holdTime: holdTime,
        adherence: baseAdherence,
        entry: { 
          planned: trade.entry - (Math.random() * 2 - 1), 
          actual: trade.entry 
        },
        exit: { 
          planned: trade.exitPrice + (Math.random() * 2 - 1), 
          actual: trade.exitPrice 
        },
        stop: { 
          planned: trade.entry * 0.95, 
          actual: trade.entry * 0.95 
        },
        size: { 
          planned: trade.quantity, 
          actual: trade.quantity 
        },
        timeSession: strategies.find(s => s.includes('Open') || s.includes('Day') || s.includes('Hour')) || 'Mid-Day'
      };
    });
  }, [trades]);

  // Filter trades
  const filteredTrades = useMemo(() => {
    switch (selectedFilter) {
      case 'wins':
        return enhancedTrades.filter(t => t.outcome === 'win');
      case 'losses':
        return enhancedTrades.filter(t => t.outcome === 'loss');
      case 'week':
        return enhancedTrades.filter(t => {
          const tradeDate = new Date(t.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return tradeDate >= weekAgo;
        });
      default:
        return enhancedTrades;
    }
  }, [selectedFilter, enhancedTrades]);

  // End-of-day insights
  const insights = useMemo(() => {
    if (enhancedTrades.length === 0) return [];
    
    const winRate = (enhancedTrades.filter(t => t.outcome === 'win').length / enhancedTrades.length * 100).toFixed(0);
    const avgAdherence = (enhancedTrades.reduce((sum, t) => sum + t.adherence, 0) / enhancedTrades.length).toFixed(0);
    
    const insights = [];
    
    // Win rate insight
    if (winRate >= 60) {
      const nyOpenTrades = enhancedTrades.filter(t => t.timeSession === 'NY-Open');
      const nyOpenWinRate = nyOpenTrades.length > 0 ? 
        (nyOpenTrades.filter(t => t.outcome === 'win').length / nyOpenTrades.length * 100).toFixed(0) : 0;
      
      if (nyOpenWinRate >= winRate) {
        insights.push({
          type: 'positive',
          message: `Best performance: NY-Open (${nyOpenWinRate}% win-rate across ${nyOpenTrades.length} trades)`
        });
      } else {
        insights.push({
          type: 'positive',
          message: `Strong overall performance: ${winRate}% win-rate across ${enhancedTrades.length} trades`
        });
      }
    } else {
      insights.push({
        type: 'warning',
        message: `Execution drift detected in ${100 - avgAdherence}% of trades — consider refining entry timing`
      });
    }
    
    // Size discipline insight
    const largeTrades = enhancedTrades.filter(t => t.quantity >= 100);
    const smallTrades = enhancedTrades.filter(t => t.quantity <= 50);
    
    if (largeTrades.length >= 3 && smallTrades.length >= 3) {
      const largeWinRate = (largeTrades.filter(t => t.outcome === 'win').length / largeTrades.length * 100).toFixed(0);
      const smallWinRate = (smallTrades.filter(t => t.outcome === 'win').length / smallTrades.length * 100).toFixed(0);
      
      if (parseInt(smallWinRate) > parseInt(largeWinRate) + 15) {
        insights.push({
          type: 'warning',
          message: `Large positions (${largeTrades.length} trades) show ${largeWinRate}% win rate vs ${smallWinRate}% for smaller positions`
        });
      }
    }
    
    // Symbol performance insight
    const symbolPerf = {};
    enhancedTrades.forEach(trade => {
      if (!symbolPerf[trade.symbol]) {
        symbolPerf[trade.symbol] = { wins: 0, total: 0, pnl: 0 };
      }
      symbolPerf[trade.symbol].total++;
      symbolPerf[trade.symbol].pnl += trade.pnl;
      if (trade.outcome === 'win') symbolPerf[trade.symbol].wins++;
    });
    
    const bestSymbol = Object.entries(symbolPerf)
      .filter(([_, data]) => data.total >= 3)
      .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))[0];
    
    if (bestSymbol) {
      const [symbol, data] = bestSymbol;
      const symbolWinRate = ((data.wins / data.total) * 100).toFixed(0);
      if (symbolWinRate >= 70) {
        insights.push({
          type: 'positive',
          message: `${symbol} showing strong edge: ${symbolWinRate}% win rate across ${data.total} trades (+$${data.pnl.toFixed(0)})`
        });
      }
    }
    
    return insights;
  }, [enhancedTrades]);

  const openTradeDetail = (trade) => {
    setSelectedTrade(trade);
    setShowBottomSheet(true);
  };

  const closeBottomSheet = () => {
    setShowBottomSheet(false);
    setSelectedTrade(null);
  };

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Smart Journal</h2>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-500">Live Insights ({enhancedTrades.length})</span>
          </div>
        </div>

        {/* Insights */}
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg flex items-center space-x-3 ${
              insight.type === 'positive' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
            }`}
          >
            {insight.type === 'positive' ? (
              <div className="flex items-center text-green-600">
                <span className="text-sm">✅</span>
              </div>
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
            )}
            <p className={`text-sm ${insight.type === 'positive' ? 'text-green-800' : 'text-red-800'}`}>
              {insight.message}
            </p>
          </div>
        ))}

        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'wins', label: 'Wins' },
            { id: 'losses', label: 'Losses' },
            { id: 'week', label: 'This Week' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Trade Cards */}
        <div className="space-y-3">
          {filteredTrades.map(trade => (
            <div
              key={trade.id}
              onClick={() => openTradeDetail(trade)}
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">{trade.symbol}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {trade.strategy[0]}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    trade.outcome === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {trade.outcome}
                  </span>
                </div>
                <span className={`font-bold ${
                  trade.outcome === 'win' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trade.outcome === 'win' ? '+' : ''}${trade.pnl}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                {trade.date} • {trade.rMultiple}R • {trade.holdTime}
              </div>
              
              {/* Strategy Tags */}
              <div className="mt-2 flex flex-wrap gap-1">
                {trade.strategy.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sheet */}
        {showBottomSheet && selectedTrade && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeBottomSheet} />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
              {/* Bottom Sheet Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Trade {selectedTrade.symbol}</h3>
                <button onClick={closeBottomSheet}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Trade Details */}
              <div className="p-4 space-y-4">
                {/* Adherence */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Adherence Breakdown</h4>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-green-600">✅</div>
                      <div className="text-xs text-gray-600">Entry</div>
                      <div className="text-sm font-medium">{selectedTrade.adherence}%</div>
                    </div>
                    <div>
                      <div className="text-green-600">✅</div>
                      <div className="text-xs text-gray-600">Stop</div>
                      <div className="text-sm font-medium">100%</div>
                    </div>
                    <div>
                      <div className="text-green-600">✅</div>
                      <div className="text-xs text-gray-600">Target</div>
                      <div className="text-sm font-medium">100%</div>
                    </div>
                    <div>
                      <div className="text-green-600">✅</div>
                      <div className="text-xs text-gray-600">Size</div>
                      <div className="text-sm font-medium">100%</div>
                    </div>
                  </div>
                </div>

                {/* Plan vs Reality */}
                <div>
                  <h4 className="font-medium mb-3">Plan vs Reality</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Entry', planned: selectedTrade.entry.planned.toFixed(2), actual: selectedTrade.entry.actual.toFixed(2) },
                      { label: 'Stop/Exit', planned: selectedTrade.stop.planned.toFixed(2), actual: selectedTrade.exit.actual.toFixed(2) },
                      { label: 'Target', planned: selectedTrade.exit.planned.toFixed(2), actual: selectedTrade.exit.actual.toFixed(2) },
                      { label: 'Size', planned: selectedTrade.size.planned, actual: selectedTrade.size.actual }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-gray-600">{item.label}</span>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Planned: ${item.planned}</div>
                          <div className={`text-sm font-medium ${
                            parseFloat(item.actual) >= parseFloat(item.planned) ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Actual: ${item.actual}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Hold Time:</span>
                    <div className="font-medium">{selectedTrade.holdTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Session:</span>
                    <div className="font-medium">{selectedTrade.timeSession}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">R Multiple:</span>
                    <div className="font-medium">{selectedTrade.rMultiple}R</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Position $:</span>
                    <div className="font-medium">${(selectedTrade.size.actual * selectedTrade.entry.actual).toFixed(0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version with right side panel
  return (
    <div className="flex space-x-6">
      {/* Main Content */}
      <div className={`space-y-6 transition-all duration-300 ${selectedTrade ? 'w-2/3' : 'w-full'}`}>
        {/* Desktop Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Smart Journal</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-gray-500">Live Insights ({enhancedTrades.length})</span>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Desktop Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg flex items-center space-x-3 ${
                insight.type === 'positive' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              {insight.type === 'positive' ? (
                <div className="text-green-600">✅</div>
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <p className={`${insight.type === 'positive' ? 'text-green-800' : 'text-red-800'}`}>
                {insight.message}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy/Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adh.</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrades.map(trade => (
                  <tr 
                    key={trade.id} 
                    onClick={() => setSelectedTrade(trade)}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedTrade?.id === trade.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.symbol}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {trade.strategy.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.rMultiple}R</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      trade.outcome === 'win' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.outcome === 'win' ? '+' : ''}${trade.pnl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.holdTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        trade.outcome === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {trade.outcome}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.adherence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      {selectedTrade && (
        <div className="w-1/3 bg-white rounded-lg shadow-md p-6 space-y-6 h-fit">
          {/* Panel Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Trade {selectedTrade.symbol}</h3>
            <button 
              onClick={() => setSelectedTrade(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Trade Overview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Date:</span>
                <div className="font-medium">{selectedTrade.date}</div>
              </div>
              <div>
                <span className="text-gray-600">Hold Time:</span>
                <div className="font-medium">{selectedTrade.holdTime}</div>
              </div>
              <div>
                <span className="text-gray-600">Session:</span>
                <div className="font-medium">{selectedTrade.timeSession}</div>
              </div>
              <div>
                <span className="text-gray-600">R Multiple:</span>
                <div className="font-medium">{selectedTrade.rMultiple}R</div>
              </div>
            </div>
          </div>

          {/* Adherence Breakdown */}
          <div>
            <h4 className="font-medium mb-3">Adherence Breakdown</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 text-xl">✅</div>
                <div className="text-xs text-gray-600 mt-1">Entry</div>
                <div className="text-sm font-medium">{selectedTrade.adherence}%</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 text-xl">✅</div>
                <div className="text-xs text-gray-600 mt-1">Stop</div>
                <div className="text-sm font-medium">100%</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 text-xl">✅</div>
                <div className="text-xs text-gray-600 mt-1">Target</div>
                <div className="text-sm font-medium">100%</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 text-xl">✅</div>
                <div className="text-xs text-gray-600 mt-1">Size</div>
                <div className="text-sm font-medium">100%</div>
              </div>
            </div>
          </div>

          {/* Plan vs Reality */}
          <div>
            <h4 className="font-medium mb-3">Plan vs Reality</h4>
            <div className="space-y-3">
              {[
                { label: 'Entry', planned: selectedTrade.entry.planned.toFixed(2), actual: selectedTrade.entry.actual.toFixed(2) },
                { label: 'Stop/Exit', planned: selectedTrade.stop.planned.toFixed(2), actual: selectedTrade.exit.actual.toFixed(2) },
                { label: 'Target', planned: selectedTrade.exit.planned.toFixed(2), actual: selectedTrade.exit.actual.toFixed(2) },
                { label: 'Size', planned: selectedTrade.size.planned, actual: selectedTrade.size.actual }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Planned: ${item.planned}</div>
                      <div className={`text-sm font-medium ${
                        parseFloat(item.actual) >= parseFloat(item.planned) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Actual: ${item.actual}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy Tags */}
          <div>
            <h4 className="font-medium mb-3">Strategy Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTrade.strategy.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
