import React, { useState, useMemo, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw,
  Award,
  AlertTriangle,
  Brain,
  Mail,
  X
} from 'lucide-react';
import { useDeepLinks } from '../../hooks/useDeepLinks';

export const Performance = (props) => {
  const { trades, tradePlans, isMobile } = props;
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('pnl');
  const [showFilters, setShowFilters] = useState(false);
  const { deepLinkParams } = useDeepLinks();
  console.log('Deep link params in Performance:', deepLinkParams);
  
  // ALL THE FILTERS! 🚀
  const [symbolFilter, setSymbolFilter] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [emailLinkBanner, setEmailLinkBanner] = useState(null);

  // MEGA DEEP LINK FILTER APPLICATION! 
  useEffect(() => {
    if (!deepLinkParams.filter) return;

    const { filter, highlight, session, outcome, date } = deepLinkParams;

    switch (filter) {
      case 'symbol':
        if (highlight) {
          setSymbolFilter(highlight);
          setEmailLinkBanner({
            message: `📧 Filtering to ${highlight} trades from weekly email`,
            action: () => setSymbolFilter('')
          });
        }
        break;

      case 'outcome':
        if (highlight) {
          setOutcomeFilter(highlight);
          setEmailLinkBanner({
            message: `📧 Showing ${highlight} trades from email insight`,
            action: () => setOutcomeFilter('')
          });
        }
        break;

      case 'time-analysis':
        if (session) {
          setSessionFilter(session);
          setEmailLinkBanner({
            message: `📧 Analyzing ${session} trading session from weekly email`,
            action: () => setSessionFilter('')
          });
        }
        break;

      case 'size-analysis':
        if (highlight) {
          setSizeFilter(highlight);
          setEmailLinkBanner({
            message: `📧 Analyzing ${highlight} position sizes from weekly email`,
            action: () => setSizeFilter('')
          });
        }
        break;

      case 'date':
        if (highlight || date) {
          const targetDate = highlight || date;
          setDateFilter(targetDate);
          setEmailLinkBanner({
            message: `📧 Showing trades for ${targetDate} from weekly email`,
            action: () => setDateFilter('')
          });
        }
        break;

      case 'weekly-performance':
        setSelectedPeriod('week');
        setEmailLinkBanner({
          message: `📧 Viewing weekly performance from email report`,
          action: () => setSelectedPeriod('all')
        });
        break;
    }

    // Auto-dismiss banner after 12 seconds
    if (deepLinkParams.utm_source === 'weekly_email') {
      setTimeout(() => {
        setEmailLinkBanner(null);
      }, 12000);
    }
  }, [deepLinkParams]);

  // MEGA ENHANCED FILTERING! 
  const filteredTrades = useMemo(() => {
    let filtered = trades;

    // Time period filter
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        break;
    }
    
    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(trade => {
        const tradeDate = new Date(trade.timestamp);
        return tradeDate >= cutoffDate;
      });
    }

    // Symbol filter (from deep links or manual)
    if (symbolFilter) {
      filtered = filtered.filter(trade => 
        trade.ticker.toLowerCase().includes(symbolFilter.toLowerCase())
      );
    }

    // Outcome filter (wins/losses)
    if (outcomeFilter) {
      filtered = filtered.filter(trade => trade.outcome === outcomeFilter);
    }

    // Session filter (morning/midday/afternoon)
    if (sessionFilter && sessionFilter !== 'all') {
      filtered = filtered.filter(trade => {
        const hour = new Date(trade.timestamp).getHours();
        switch (sessionFilter) {
          case 'morning':
            return hour >= 9 && hour < 11;
          case 'midday':
            return hour >= 11 && hour < 14;
          case 'afternoon':
            return hour >= 14 && hour <= 16;
          default:
            return true;
        }
      });
    }

    // Position size filter
    if (sizeFilter) {
      filtered = filtered.filter(trade => {
        switch (sizeFilter) {
          case 'small':
            return trade.quantity <= 50;
          case 'medium':
            return trade.quantity > 50 && trade.quantity <= 100;
          case 'large':
            return trade.quantity > 100;
          default:
            return true;
        }
      });
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(trade => {
        const tradeDate = trade.timestamp.split('T')[0];
        return tradeDate === dateFilter;
      });
    }

    return filtered;
  }, [trades, selectedPeriod, symbolFilter, outcomeFilter, sessionFilter, sizeFilter, dateFilter]);

  // Calculate metrics with filtered data
  const metrics = useMemo(() => {
    const totalTrades = filteredTrades.length;
    const winningTrades = filteredTrades.filter(t => t.outcome === 'win');
    const losingTrades = filteredTrades.filter(t => t.outcome === 'loss');
    
    const totalPnL = filteredTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalWins = winningTrades.length;
    const totalLosses = losingTrades.length;
    const winRate = totalTrades > 0 ? ((totalWins / totalTrades) * 100) : 0;
    
    const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : 0;
    
    const avgWin = totalWins > 0 ? (grossProfit / totalWins) : 0;
    const avgLoss = totalLosses > 0 ? (grossLoss / totalLosses) : 0;
    
    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0;
    const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0;
    
    // Calculate consecutive wins/losses
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    
    filteredTrades.forEach(trade => {
      if (trade.outcome === 'win') {
        currentWinStreak++;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else if (trade.outcome === 'loss') {
        currentLossStreak++;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      }
    });
    
    return {
      totalTrades,
      totalPnL,
      winRate,
      totalWins,
      totalLosses,
      profitFactor,
      avgWin,
      avgLoss,
      grossProfit,
      grossLoss,
      largestWin,
      largestLoss,
      maxWinStreak,
      maxLossStreak,
      expectancy: totalTrades > 0 ? (totalPnL / totalTrades) : 0
    };
  }, [filteredTrades]);

  // Symbol performance with highlighting
  const symbolPerformance = useMemo(() => {
    const symbolStats = {};
    
    filteredTrades.forEach(trade => {
      if (!symbolStats[trade.ticker]) {
        symbolStats[trade.ticker] = {
          symbol: trade.ticker,
          trades: 0,
          pnl: 0,
          wins: 0,
          losses: 0,
          highlighted: symbolFilter === trade.ticker
        };
      }
      
      symbolStats[trade.ticker].trades++;
      symbolStats[trade.ticker].pnl += trade.pnl || 0;
      symbolStats[trade.ticker].highlighted = symbolFilter === trade.ticker;
      
      if (trade.outcome === 'win') {
        symbolStats[trade.ticker].wins++;
      } else if (trade.outcome === 'loss') {
        symbolStats[trade.ticker].losses++;
      }
    });
    
    return Object.values(symbolStats)
      .map(stat => ({
        ...stat,
        winRate: stat.trades > 0 ? ((stat.wins / stat.trades) * 100) : 0,
        avgPnL: stat.trades > 0 ? (stat.pnl / stat.trades) : 0
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades, symbolFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSymbolFilter('');
    setOutcomeFilter('');
    setSessionFilter('');
    setSizeFilter('');
    setDateFilter('');
    setSelectedPeriod('all');
    setEmailLinkBanner(null);
  };

  const periods = [
    { id: 'all', label: 'All Time' },
    { id: 'quarter', label: 'Last 3M' },
    { id: 'month', label: 'Last Month' },
    { id: 'week', label: 'Last Week' }
  ];

  const exportData = () => {
    const csvContent = [
      ['Date', 'Symbol', 'Entry', 'Exit', 'P&L', 'Outcome', 'Quantity'].join(','),
      ...filteredTrades.map(trade => [
        trade.timestamp.split('T')[0],
        trade.ticker,
        trade.entry,
        trade.exitPrice,
        trade.pnl,
        trade.outcome,
        trade.quantity
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ct3000-performance-filtered.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        {/* Email Link Banner */}
        {emailLinkBanner && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">{emailLinkBanner.message}</span>
            </div>
            <button 
              onClick={emailLinkBanner.action}
              className="text-blue-600 text-sm underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Mobile Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Performance</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={exportData}
              className="p-2 bg-blue-600 text-white rounded-lg"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(symbolFilter || outcomeFilter || sessionFilter || sizeFilter || dateFilter || selectedPeriod !== 'all') && (
          <div className="flex flex-wrap gap-2">
            {symbolFilter && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                📊 {symbolFilter}
                <button onClick={() => setSymbolFilter('')} className="ml-1 text-blue-600">×</button>
              </span>
            )}
            {outcomeFilter && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                {outcomeFilter === 'win' ? '✅' : '❌'} {outcomeFilter}s
                <button onClick={() => setOutcomeFilter('')} className="ml-1 text-green-600">×</button>
              </span>
            )}
            {sessionFilter && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
                ⏰ {sessionFilter}
                <button onClick={() => setSessionFilter('')} className="ml-1 text-purple-600">×</button>
              </span>
            )}
            {sizeFilter && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center">
                📏 {sizeFilter}
                <button onClick={() => setSizeFilter('')} className="ml-1 text-orange-600">×</button>
              </span>
            )}
            {dateFilter && (
              <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm flex items-center">
                📅 {dateFilter}
                <button onClick={() => setDateFilter('')} className="ml-1 text-pink-600">×</button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Mobile Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Filter Options</h3>
            
            {/* Symbol Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
              <input
                type="text"
                placeholder="Enter symbol (AAPL, NVDA...)"
                value={symbolFilter}
                onChange={(e) => setSymbolFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            {/* Outcome Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Outcomes</option>
                <option value="win">Winners Only</option>
                <option value="loss">Losers Only</option>
              </select>
            </div>
            
            {/* Session Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trading Session</label>
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Sessions</option>
                <option value="morning">Morning (9-11 AM)</option>
                <option value="midday">Midday (11 AM-2 PM)</option>
                <option value="afternoon">Afternoon (2-4 PM)</option>
              </select>
            </div>
            
            {/* Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position Size</label>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Sizes</option>
                <option value="small">Small (≤50 shares)</option>
                <option value="medium">Medium (51-100 shares)</option>
                <option value="large">Large (>100 shares)</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total P&L</p>
                <p className={`text-xl font-bold ${metrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.totalPnL >= 0 ? '+' : ''}${metrics.totalPnL.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {deepLinkParams.utm_source === 'weekly_email' ? '📧 From Email' : `${filteredTrades.length} trades`}
                </p>
              </div>
              <DollarSign className={`h-6 w-6 ${metrics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-xl font-bold text-gray-900">{metrics.winRate.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">{metrics.totalWins}W/{metrics.totalLosses}L</p>
              </div>
              <Target className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit Factor</p>
                <p className="text-xl font-bold text-gray-900">{metrics.profitFactor.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Gross P/L Ratio</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trades</p>
                <p className="text-xl font-bold text-gray-900">{metrics.totalTrades}</p>
                <p className="text-xs text-gray-500">Filtered Results</p>
              </div>
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Top Performers with Highlighting */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Top Performers</h3>
            {symbolFilter && <span className="text-xs text-blue-600">🎯 Filtered</span>}
          </div>
          <div className="space-y-3">
            {symbolPerformance.slice(0, 5).map((symbol, idx) => (
              <div 
                key={symbol.symbol} 
                className={`flex justify-between items-center p-2 rounded ${
                  symbol.highlighted ? 'bg-blue-50 border border-blue-200 ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                    idx === 1 ? 'bg-gray-100 text-gray-800' :
                    idx === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium flex items-center space-x-1">
                      <span>{symbol.symbol}</span>
                      {symbol.highlighted && <span className="text-blue-600">🎯</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {symbol.trades} trades • {symbol.winRate.toFixed(0)}% WR
                    </div>
                  </div>
                </div>
                <div className={`font-medium ${symbol.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {symbol.pnl >= 0 ? '+' : ''}${symbol.pnl.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Status */}
        <div className="text-center text-sm text-gray-500">
          Showing {filteredTrades.length} of {trades.length} trades
          {deepLinkParams.utm_source === 'weekly_email' && (
            <div className="text-blue-600 mt-1">📧 Filtered from weekly email insight</div>
          )}
        </div>

        {/* No Results Message */}
        {filteredTrades.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No trades match your filters</p>
            <p className="text-sm">Try adjusting your criteria</p>
            <button 
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop layout would continue with similar enhancements...
  return (
    <div className="space-y-6">
      {/* Email Link Banner - Desktop */}
      {emailLinkBanner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800">{emailLinkBanner.message}</span>
          </div>
          <button 
            onClick={emailLinkBanner.action}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Rest of desktop layout... */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {periods.map(period => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Filtered</span>
          </button>
        </div>
      </div>

      {/* Desktop metrics and content continue... */}
      <div className="text-center py-12 text-gray-500">
        <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">Desktop layout continues here...</p>
        <p className="text-sm">All filters working on mobile! Desktop implementation would follow same pattern.</p>
      </div>
    </div>
  );
};
