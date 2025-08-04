
import React, { useState, useMemo } from 'react';
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
  Brain
} from 'lucide-react';

export const Performance = (props) => {
  const { trades, tradePlans, isMobile } = props;
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('pnl');
  const [showFilters, setShowFilters] = useState(false);

  // Filter trades by period
  const filteredTrades = useMemo(() => {
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
        return trades;
    }
    
    return trades.filter(trade => {
      const tradeDate = new Date(trade.timestamp);
      return tradeDate >= cutoffDate;
    });
  }, [trades, selectedPeriod]);

  // Calculate comprehensive metrics
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
    let currentStreak = 0;
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

  // Top performers by symbol
  const symbolPerformance = useMemo(() => {
    const symbolStats = {};
    
    filteredTrades.forEach(trade => {
      if (!symbolStats[trade.ticker]) {
        symbolStats[trade.ticker] = {
          symbol: trade.ticker,
          trades: 0,
          pnl: 0,
          wins: 0,
          losses: 0
        };
      }
      
      symbolStats[trade.ticker].trades++;
      symbolStats[trade.ticker].pnl += trade.pnl || 0;
      
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
  }, [filteredTrades]);

  // Daily P&L chart data
  const dailyPnL = useMemo(() => {
    const dailyStats = {};
    
    filteredTrades.forEach(trade => {
      const date = trade.timestamp.split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { date, pnl: 0, trades: 0 };
      }
      dailyStats[date].pnl += trade.pnl || 0;
      dailyStats[date].trades++;
    });
    
    return Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredTrades]);

  // BLEEDING DETECTOR - Key behavioral insights
  const insights = useMemo(() => {
    const insights = [];
    
    if (filteredTrades.length < 5) return insights; // Need minimum data
    
    // 1. SIZE DISCIPLINE ANALYSIS
    // Group trades by position size (if quantity data exists)
    const sizeGroups = {
      small: filteredTrades.filter(t => t.quantity <= 50),
      medium: filteredTrades.filter(t => t.quantity > 50 && t.quantity <= 100),
      large: filteredTrades.filter(t => t.quantity > 100)
    };
    
    Object.entries(sizeGroups).forEach(([size, trades]) => {
      if (trades.length >= 3) {
        const winRate = (trades.filter(t => t.outcome === 'win').length / trades.length) * 100;
        const avgPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length;
        
        if (size === 'large' && (winRate < 40 || avgPnL < -50)) {
          insights.push({
            type: 'warning',
            category: 'Size Discipline',
            title: 'Large Position Underperformance',
            message: `Your larger positions (${trades.length} trades) show ${winRate.toFixed(0)}% win rate vs smaller positions. Consider position sizing impact.`,
            severity: 'medium',
            impact: Math.abs(avgPnL * trades.length).toFixed(0)
          });
        }
      }
    });
    
    // 2. RISK/REWARD PATTERN ANALYSIS
    // Calculate R/R for trades and group by performance
    const tradesWithRR = filteredTrades.filter(t => t.entry && t.exitPrice && t.pnl);
    if (tradesWithRR.length >= 5) {
      const lowRRTrades = tradesWithRR.filter(t => {
        const risk = Math.abs(t.entry - (t.stopLoss || t.entry * 0.95));
        const reward = Math.abs(t.exitPrice - t.entry);
        const rrRatio = reward / risk;
        return rrRatio < 1.5;
      });
      
      if (lowRRTrades.length >= 3) {
        const lowRRWinRate = (lowRRTrades.filter(t => t.outcome === 'win').length / lowRRTrades.length) * 100;
        const lowRRPnL = lowRRTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
        
        if (lowRRWinRate < 65 || lowRRPnL < 0) {
          insights.push({
            type: 'warning',
            category: 'Risk Management',
            title: 'Low Risk/Reward Setup Pattern',
            message: `${lowRRTrades.length} trades with poor risk/reward ratios show ${lowRRWinRate.toFixed(0)}% win rate. These setups may need higher win rates to be profitable.`,
            severity: 'high',
            impact: Math.abs(lowRRPnL).toFixed(0)
          });
        }
      }
    }
    
    // 3. PROFIT MANAGEMENT ANALYSIS
    // Compare winning vs losing trade holding patterns
    const winners = filteredTrades.filter(t => t.outcome === 'win' && t.pnl > 0);
    const losers = filteredTrades.filter(t => t.outcome === 'loss' && t.pnl < 0);
    
    if (winners.length >= 3 && losers.length >= 3) {
      const avgWinAmount = winners.reduce((sum, t) => sum + t.pnl, 0) / winners.length;
      const avgLossAmount = Math.abs(losers.reduce((sum, t) => sum + t.pnl, 0) / losers.length);
      
      // Check if cutting winners too early vs letting losers run
      if (avgLossAmount > avgWinAmount * 1.5) {
        insights.push({
          type: 'info',
          category: 'Profit Management', 
          title: 'Winner vs Loser Size Imbalance',
          message: `Average loss (${avgLossAmount.toFixed(0)}) is ${(avgLossAmount/avgWinAmount).toFixed(1)}x larger than average win (${avgWinAmount.toFixed(0)}). Consider letting winners run longer.`,
          severity: 'medium',
          impact: ((avgLossAmount - avgWinAmount) * Math.min(winners.length, losers.length)).toFixed(0)
        });
      }
    }
    
    // 4. EXECUTION DRIFT ANALYSIS 
    // Check for systematic entry price drift from planned levels
    const plansWithExecutions = tradePlans.filter(plan => 
      filteredTrades.some(trade => trade.ticker === plan.ticker && Math.abs(new Date(trade.timestamp) - new Date(plan.timestamp)) < 24*60*60*1000)
    );
    
    if (plansWithExecutions.length >= 3) {
      let totalDrift = 0;
      let driftCount = 0;
      
      plansWithExecutions.forEach(plan => {
        const matchingTrade = filteredTrades.find(trade => 
          trade.ticker === plan.ticker && 
          Math.abs(new Date(trade.timestamp) - new Date(plan.timestamp)) < 24*60*60*1000
        );
        
        if (matchingTrade) {
          const drift = Math.abs(parseFloat(plan.entry) - matchingTrade.entry);
          const driftPercent = (drift / parseFloat(plan.entry)) * 100;
          
          if (driftPercent > 2) { // More than 2% drift
            totalDrift += driftPercent;
            driftCount++;
          }
        }
      });
      
      if (driftCount >= 2) {
        const avgDrift = totalDrift / driftCount;
        insights.push({
          type: 'info',
          category: 'Execution Quality',
          title: 'Plan vs Execution Drift',
          message: `${driftCount} trades show significant entry price drift (avg ${avgDrift.toFixed(1)}% from plan). Market timing or order management may need attention.`,
          severity: 'low',
          impact: 'execution_quality'
        });
      }
    }
    
    // 5. POSITIVE PATTERN RECOGNITION
    // Find what's actually working well
    if (metrics.winRate > 60 && metrics.totalTrades >= 5) {
      const bestSymbol = symbolPerformance[0];
      if (bestSymbol && bestSymbol.winRate > 70) {
        insights.push({
          type: 'success',
          category: 'Strength Recognition',
          title: 'Strong Symbol Performance',
          message: `${bestSymbol.symbol} shows exceptional performance: ${bestSymbol.winRate.toFixed(0)}% win rate across ${bestSymbol.trades} trades. This edge is worth exploring further.`,
          severity: 'positive',
          impact: bestSymbol.pnl.toFixed(0)
        });
      }
    }
    
    return insights.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1, positive: 0 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }, [filteredTrades, tradePlans, metrics, symbolPerformance]);

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
    a.download = `trading-performance-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
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

        {/* Mobile Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <div className="grid grid-cols-2 gap-2">
                {periods.map(period => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      selectedPeriod === period.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
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
                <p className="text-xs text-gray-500">{selectedPeriod === 'all' ? 'All time' : periods.find(p => p.id === selectedPeriod)?.label}</p>
              </div>
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Behavioral Insights - The Bleeding Detector */}
        {insights.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Trading Insights
            </h3>
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg border-l-4 ${
                    insight.type === 'warning' ? 'bg-red-50 border-red-400' :
                    insight.type === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium text-sm ${
                      insight.type === 'warning' ? 'text-red-800' :
                      insight.type === 'success' ? 'text-green-800' :
                      'text-blue-800'
                    }`}>
                      {insight.title}
                    </h4>
                    {insight.impact !== 'execution_quality' && (
                      <span className="text-xs text-gray-500">
                        ${insight.impact} impact
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    insight.type === 'warning' ? 'text-red-700' :
                    insight.type === 'success' ? 'text-green-700' :
                    'text-blue-700'
                  }`}>
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-3">Performance Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Win</span>
              <span className="font-medium text-green-600">+${metrics.avgWin.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Loss</span>
              <span className="font-medium text-red-600">-${metrics.avgLoss.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Largest Win</span>
              <span className="font-medium text-green-600">+${metrics.largestWin.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Largest Loss</span>
              <span className="font-medium text-red-600">${metrics.largestLoss.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Best Win Streak</span>
              <span className="font-medium text-blue-600">{metrics.maxWinStreak} trades</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expectancy</span>
              <span className={`font-medium ${metrics.expectancy >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${metrics.expectancy.toFixed(0)}/trade
              </span>
            </div>
          </div>
        </div>

        {/* Top Symbols */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-3">Top Performers</h3>
          <div className="space-y-3">
            {symbolPerformance.slice(0, 5).map((symbol, idx) => (
              <div key={symbol.symbol} className="flex justify-between items-center">
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
                    <div className="font-medium">{symbol.symbol}</div>
                    <div className="text-xs text-gray-500">{symbol.trades} trades • {symbol.winRate.toFixed(0)}% WR</div>
                  </div>
                </div>
                <div className={`font-medium ${symbol.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {symbol.pnl >= 0 ? '+' : ''}${symbol.pnl.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily P&L Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-3">Daily P&L Trend</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Chart visualization would be implemented here</p>
            <p className="text-xs text-gray-500 mt-1">Using libraries like Recharts or Chart.js</p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
        <div className="flex items-center space-x-4">
          {/* Period Selector */}
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
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total P&L</p>
              <p className={`text-3xl font-bold mt-1 ${metrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.totalPnL >= 0 ? '+' : ''}${metrics.totalPnL.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedPeriod === 'all' ? 'All time' : periods.find(p => p.id === selectedPeriod)?.label}
              </p>
            </div>
            <DollarSign className={`h-8 w-8 ${metrics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.winRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">{metrics.totalWins}W / {metrics.totalLosses}L</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Factor</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.profitFactor.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Gross Profit/Loss</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalTrades}</p>
              <p className="text-xs text-gray-500 mt-1">Expectancy: ${metrics.expectancy.toFixed(0)}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts and Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Behavioral Insights Section - The Bleeding Detector */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="h-5 w-5 text-purple-600 mr-2" />
            Trading Intelligence
          </h3>
          
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'warning' ? 'bg-red-50 border-red-400' :
                    insight.type === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      {insight.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : insight.type === 'success' ? (
                        <Award className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      )}
                      <h4 className={`font-medium ${
                        insight.type === 'warning' ? 'text-red-800' :
                        insight.type === 'success' ? 'text-green-800' :
                        'text-blue-800'
                      }`}>
                        {insight.title}
                      </h4>
                    </div>
                    {insight.impact !== 'execution_quality' && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ${insight.impact} impact
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    insight.type === 'warning' ? 'text-red-700' :
                    insight.type === 'success' ? 'text-green-700' :
                    'text-blue-700'
                  }`}>
                    {insight.message}
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.type === 'warning' ? 'bg-red-100 text-red-600' :
                      insight.type === 'success' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {insight.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Building insights...</p>
              <p className="text-xs mt-1">More data needed for pattern analysis</p>
            </div>
          )}
        </div>
        {/* Performance Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Breakdown</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Winning Trades</h4>
                <p className="text-2xl font-bold text-green-600">+${metrics.grossProfit.toLocaleString()}</p>
                <p className="text-sm text-green-700">Avg: ${metrics.avgWin.toFixed(0)}</p>
                <p className="text-xs text-green-600 mt-1">Best: +${metrics.largestWin.toFixed(0)}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Losing Trades</h4>
                <p className="text-2xl font-bold text-red-600">-${metrics.grossLoss.toLocaleString()}</p>
                <p className="text-sm text-red-700">Avg: -${metrics.avgLoss.toFixed(0)}</p>
                <p className="text-xs text-red-600 mt-1">Worst: ${metrics.largestLoss.toFixed(0)}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Best Win Streak</span>
                <span className="font-medium text-green-600">{metrics.maxWinStreak} trades</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Worst Loss Streak</span>
                <span className="font-medium text-red-600">{metrics.maxLossStreak} trades</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Symbols */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Symbols</h3>
          <div className="space-y-3">
            {symbolPerformance.slice(0, 8).map((symbol, idx) => (
              <div key={symbol.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                    idx === 1 ? 'bg-gray-100 text-gray-800' :
                    idx === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{symbol.symbol}</div>
                    <div className="text-sm text-gray-500">
                      {symbol.trades} trades • {symbol.winRate.toFixed(0)}% win rate
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${symbol.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {symbol.pnl >= 0 ? '+' : ''}${symbol.pnl.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${symbol.avgPnL.toFixed(0)}/trade
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily P&L Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Daily P&L Performance</h3>
          <div className="text-sm text-gray-500">
            {dailyPnL.length} trading days
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Interactive P&L Chart</p>
          <p className="text-sm text-gray-500">
            This would show daily P&L trends, cumulative performance, and drawdown analysis
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Implementation with Recharts: LineChart for cumulative P&L, BarChart for daily P&L
          </p>
        </div>
      </div>
    </div>
  );
};
