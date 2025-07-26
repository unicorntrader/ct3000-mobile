import React, { useState, useMemo } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Calendar, DollarSign } from 'lucide-react';

export const SmartJournal = (props) => {
  const { trades, tradePlans, isMobile } = props;
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // AI-like insights based on trading data
  const insights = useMemo(() => {
    const winningTrades = trades.filter(t => t.outcome === 'win');
    const losingTrades = trades.filter(t => t.outcome === 'loss');
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length * 100).toFixed(1) : 0;
    const avgWin = winningTrades.length > 0 ? (winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length).toFixed(2) : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length).toFixed(2) : 0;

    return [
      {
        type: 'performance',
        title: 'Win Rate Analysis',
        message: `Your ${winRate}% win rate is ${winRate > 60 ? 'excellent' : winRate > 45 ? 'good' : 'needs improvement'}. Focus on ${winRate < 50 ? 'trade selection' : 'position sizing'}.`,
        severity: winRate > 60 ? 'positive' : winRate > 45 ? 'neutral' : 'warning',
        icon: TrendingUp
      },
      {
        type: 'risk',
        title: 'Risk Management',
        message: avgWin && avgLoss ? `Your avg win ($${avgWin}) to avg loss ($${avgLoss}) ratio is ${(avgWin/avgLoss).toFixed(1)}:1. ${avgWin/avgLoss > 2 ? 'Excellent risk management!' : 'Consider letting winners run longer.'}` : 'Need more trade data for analysis.',
        severity: avgWin/avgLoss > 2 ? 'positive' : avgWin/avgLoss > 1.5 ? 'neutral' : 'warning',
        icon: AlertTriangle
      },
      {
        type: 'planning',
        title: 'Trade Planning',
        message: `You have ${tradePlans.filter(p => p.status === 'planned').length} active plans. ${tradePlans.length > 5 ? 'Great planning ahead!' : 'Consider planning more trades in advance.'}`,
        severity: tradePlans.length > 5 ? 'positive' : 'neutral',
        icon: Target
      }
    ];
  }, [trades, tradePlans]);

  const patterns = useMemo(() => {
    // Simple pattern detection
    const tickerCounts = {};
    trades.forEach(trade => {
      tickerCounts[trade.ticker] = (tickerCounts[trade.ticker] || 0) + 1;
    });

    const mostTraded = Object.entries(tickerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      mostTraded,
      timePreference: 'Morning sessions (9:30-11:00 AM)', // Mock data
      bestPerformingSetup: 'Breakout trades',
      suggestion: 'Your breakout trades have 75% win rate. Focus more on these setups.'
    };
  }, [trades]);

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Smart Journal</h2>
          <Brain className="h-6 w-6 text-purple-600" />
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-2">
          {['week', 'month', 'quarter'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedTimeframe === period
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.severity === 'positive' ? 'bg-green-50 border-green-500' :
                  insight.severity === 'warning' ? 'bg-red-50 border-red-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${
                    insight.severity === 'positive' ? 'text-green-600' :
                    insight.severity === 'warning' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trading Patterns */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Trading Patterns</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-700">Most Traded Symbols</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {patterns.mostTraded.map(([ticker, count]) => (
                  <span key={ticker} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {ticker} ({count})
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Best Setup</h4>
              <p className="text-sm text-gray-600 mt-1">{patterns.bestPerformingSetup}</p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">💡 Suggestion</h4>
              <p className="text-sm text-purple-700 mt-1">{patterns.suggestion}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Smart Journal</h2>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span className="text-sm text-gray-500">AI-Powered Insights</span>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-4">
        {['week', 'month', 'quarter', 'year'].map(period => (
          <button
            key={period}
            onClick={() => setSelectedTimeframe(period)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedTimeframe === period
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.severity === 'positive' ? 'bg-green-50 border-green-500' :
                    insight.severity === 'warning' ? 'bg-red-50 border-red-500' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${
                      insight.severity === 'positive' ? 'text-green-600' :
                      insight.severity === 'warning' ? 'text-red-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trading Patterns */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Patterns</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Most Traded Symbols</h4>
              <div className="flex flex-wrap gap-2">
                {patterns.mostTraded.map(([ticker, count]) => (
                  <span key={ticker} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {ticker} ({count} trades)
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Preferred Trading Time</h4>
              <p className="text-sm text-gray-600 mt-1">{patterns.timePreference}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Best Performing Setup</h4>
              <p className="text-sm text-gray-600 mt-1">{patterns.bestPerformingSetup}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 flex items-center">
                <span className="mr-2">💡</span>
                AI Suggestion
              </h4>
              <p className="text-sm text-purple-700 mt-2">{patterns.suggestion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
