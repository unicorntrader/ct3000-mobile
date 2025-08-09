import React, { useState, useMemo } from 'react';
import {
  Brain,
  Upload,
  FileText,
  AlertTriangle,
  Award,
  Target,
  Zap,
  Download,
  X,
  Settings,
  Toggle,
  Eye,
  EyeOff
} from 'lucide-react';

const InsightDetector = ({ trades: propTrades = [], onTradesUpdate }) => {
  const [uploadedTrades, setUploadedTrades] = useState([]);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [useDummyData, setUseDummyData] = useState(true); // Toggle for dummy data

  // 🎛️ INSIGHT CONTROLS - User can toggle these on/off
  const [insightSettings, setInsightSettings] = useState({
    planning_analysis: true,      // Planning vs unplanned performance
    size_discipline: true,        // Position sizing analysis
    strategy_performance: true,   // Best/worst strategies
    profit_management: true,      // Winner/loser ratio
    timing_edge: true,           // Best trading times
    revenge_trading: true,       // Emotional trading detection
  });

  // Dummy trades - only used if useDummyData is true
  const dummyTrades = useDummyData ? [
    // Planned vs Unplanned examples
    { id: 1001, ticker: 'AAPL', entry: 175, exit: 182, quantity: 100, pnl: 700, outcome: 'win', timestamp: '2025-01-15T09:30:00Z', planned: true, strategy: 'breakout' },
    { id: 1002, ticker: 'MSFT', entry: 420, exit: 415, quantity: 150, pnl: -750, outcome: 'loss', timestamp: '2025-01-15T14:30:00Z', planned: false, strategy: null },
    { id: 1003, ticker: 'NVDA', entry: 450, exit: 468, quantity: 50, pnl: 900, outcome: 'win', timestamp: '2025-01-16T09:45:00Z', planned: true, strategy: 'momentum' },
    
    // Size discipline examples
    { id: 1004, ticker: 'TSLA', entry: 250, exit: 245, quantity: 200, pnl: -1000, outcome: 'loss', timestamp: '2025-01-16T11:00:00Z', planned: false, strategy: null },
    { id: 1005, ticker: 'GOOGL', entry: 135, exit: 142, quantity: 25, pnl: 175, outcome: 'win', timestamp: '2025-01-17T10:15:00Z', planned: true, strategy: 'breakout' },
    
    // Strategy examples
    { id: 1006, ticker: 'META', entry: 320, exit: 325, quantity: 75, pnl: 375, outcome: 'win', timestamp: '2025-01-17T13:20:00Z', planned: true, strategy: 'momentum' },
    { id: 1007, ticker: 'AMD', entry: 145, exit: 142, quantity: 100, pnl: -300, outcome: 'loss', timestamp: '2025-01-18T09:30:00Z', planned: true, strategy: 'breakout' },
    
    // Time-based examples
    { id: 1008, ticker: 'SPY', entry: 455, exit: 458, quantity: 80, pnl: 240, outcome: 'win', timestamp: '2025-01-18T10:45:00Z', planned: true, strategy: 'momentum' },
    { id: 1009, ticker: 'QQQ', entry: 375, exit: 378, quantity: 60, pnl: 180, outcome: 'win', timestamp: '2025-01-19T11:30:00Z', planned: true, strategy: 'momentum' },
    
    // Revenge trading examples
    { id: 1010, ticker: 'AMD', entry: 148, exit: 145, quantity: 300, pnl: -900, outcome: 'loss', timestamp: '2025-01-22T10:30:00Z', planned: false, strategy: null, afterLoss: true }
  ] : [];

  // Use uploaded trades > real trades > dummy trades (based on settings)
  const allTrades = uploadedTrades.length > 0 ? uploadedTrades : [...propTrades, ...dummyTrades];

  // 🧠 INSIGHT DETECTOR WITH USER CONTROLS
  const insights = useMemo(() => {
    const insights = [];
    
    if (allTrades.length < 8) {
      return [{
        id: 'insufficient_data',
        category: 'Getting Started',
        type: 'info',
        priority: 'low',
        title: 'Building Your Intelligence Profile',
        message: `Analyzing ${allTrades.length} trades. Need 8+ trades to unlock behavioral insights.`,
        impact: 'building',
        affectedTrades: [],
        confidence: 0
      }];
    }

    // 1. 🎯 PLANNING ANALYSIS (if enabled)
    if (insightSettings.planning_analysis) {
      const plannedTrades = allTrades.filter(t => t.planned === true);
      const unplannedTrades = allTrades.filter(t => t.planned === false);
      
      if (plannedTrades.length >= 3 && unplannedTrades.length >= 3) {
        const plannedAvgPnL = plannedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / plannedTrades.length;
        const unplannedAvgPnL = unplannedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / unplannedTrades.length;
        const difference = Math.abs(plannedAvgPnL - unplannedAvgPnL);
        
        if (difference > 75) {
          if (plannedAvgPnL > unplannedAvgPnL) {
            insights.push({
              id: 'planning_advantage',
              category: 'Core Edge',
              type: 'success',
              priority: 'high',
              title: 'Pre-Market Planning Edge',
              message: `Planned trades average $${plannedAvgPnL.toFixed(0)} vs unplanned $${unplannedAvgPnL.toFixed(0)}. Your preparation creates real edge.`,
              impact: `+$${((plannedAvgPnL - unplannedAvgPnL) * plannedTrades.length).toFixed(0)}`,
              affectedTrades: plannedTrades,
              confidence: 90,
              action: 'Plan every trade before market open. Your discipline pays.'
            });
          } else {
            insights.push({
              id: 'overthinking_penalty',
              category: 'Core Edge',
              type: 'warning',
              priority: 'high',
              title: 'Over-Planning Performance Drag',
              message: `Unplanned trades outperform planned trades by $${difference.toFixed(0)} average. Your instincts may be sharper than your plans.`,
              impact: `-$${Math.abs((plannedAvgPnL - unplannedAvgPnL) * plannedTrades.length).toFixed(0)}`,
              affectedTrades: plannedTrades,
              confidence: 85,
              action: 'Trust your instincts more. Simplify your planning process.'
            });
          }
        }
      }
    }

    // 2. 💰 SIZE DISCIPLINE (if enabled)
    if (insightSettings.size_discipline) {
      const smallTrades = allTrades.filter(t => t.quantity <= 50);
      const mediumTrades = allTrades.filter(t => t.quantity > 50 && t.quantity <= 100);
      const largeTrades = allTrades.filter(t => t.quantity > 100);
      
      const analyzeSize = (trades, label) => {
        if (trades.length < 3) return null;
        return {
          label,
          count: trades.length,
          avgPnL: trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length,
          totalPnL: trades.reduce((sum, t) => sum + (t.pnl || 0), 0),
          winRate: (trades.filter(t => t.outcome === 'win').length / trades.length) * 100
        };
      };

      const sizeAnalysis = [
        analyzeSize(smallTrades, 'Small'),
        analyzeSize(mediumTrades, 'Medium'), 
        analyzeSize(largeTrades, 'Large')
      ].filter(Boolean);

      if (sizeAnalysis.length >= 2) {
        const bestSize = sizeAnalysis.sort((a, b) => b.avgPnL - a.avgPnL)[0];
        const worstSize = sizeAnalysis.sort((a, b) => a.avgPnL - b.avgPnL)[0];
        
        if (bestSize.avgPnL > worstSize.avgPnL + 150) {
          const bestTrades = bestSize.label === 'Small' ? smallTrades : bestSize.label === 'Medium' ? mediumTrades : largeTrades;
          
          insights.push({
            id: 'size_sweet_spot',
            category: 'Risk Management',
            type: 'success',
            priority: 'high',
            title: `${bestSize.label} Position Sweet Spot`,
            message: `${bestSize.label} positions are your sweet spot: ${bestSize.winRate.toFixed(0)}% win rate, $${bestSize.avgPnL.toFixed(0)} average.`,
            impact: `+$${bestSize.totalPnL.toFixed(0)}`,
            affectedTrades: bestTrades,
            confidence: 88,
            action: `Focus 80% of your trading on ${bestSize.label.toLowerCase()} positions.`
          });
        }
        
        if (worstSize.avgPnL < -100 && worstSize.count >= 3) {
          const worstTrades = worstSize.label === 'Small' ? smallTrades : worstSize.label === 'Medium' ? mediumTrades : largeTrades;
          
          insights.push({
            id: 'size_bleeding',
            category: 'Risk Management',
            type: 'warning',
            priority: 'high',
            title: `${worstSize.label} Position Bleeding`,
            message: `${worstSize.label} positions are bleeding: $${worstSize.avgPnL.toFixed(0)} average across ${worstSize.count} trades.`,
            impact: `-$${Math.abs(worstSize.totalPnL).toFixed(0)}`,
            affectedTrades: worstTrades,
            confidence: 85,
            action: `Reduce ${worstSize.label.toLowerCase()} position sizes by 50% immediately.`
          });
        }
      }
    }

    // 3. 🏆 STRATEGY PERFORMANCE (if enabled)
    if (insightSettings.strategy_performance) {
      const strategyStats = {};
      allTrades.forEach(trade => {
        const strategy = trade.strategy || 'unassigned';
        if (!strategyStats[strategy]) {
          strategyStats[strategy] = { trades: [], wins: 0, totalPnL: 0 };
        }
        strategyStats[strategy].trades.push(trade);
        strategyStats[strategy].totalPnL += trade.pnl || 0;
        if (trade.outcome === 'win') strategyStats[strategy].wins++;
      });

      const validStrategies = Object.entries(strategyStats)
        .filter(([strategy, stats]) => stats.trades.length >= 4 && strategy !== 'unassigned')
        .map(([strategy, stats]) => ({
          strategy,
          ...stats,
          winRate: (stats.wins / stats.trades.length) * 100,
          avgPnL: stats.totalPnL / stats.trades.length
        }))
        .sort((a, b) => b.avgPnL - a.avgPnL);

      if (validStrategies.length > 0) {
        const bestStrategy = validStrategies[0];
        if (bestStrategy.winRate >= 65 && bestStrategy.avgPnL > 150) {
          insights.push({
            id: `strategy_mastery_${bestStrategy.strategy}`,
            category: 'Strategy Edge',
            type: 'success',
            priority: 'medium',
            title: `${bestStrategy.strategy.charAt(0).toUpperCase() + bestStrategy.strategy.slice(1)} Mastery`,
            message: `${bestStrategy.strategy} strategy: ${bestStrategy.winRate.toFixed(0)}% win rate, $${bestStrategy.avgPnL.toFixed(0)} average.`,
            impact: `+$${bestStrategy.totalPnL.toFixed(0)}`,
            affectedTrades: bestStrategy.trades,
            confidence: 82,
            action: `Double down on ${bestStrategy.strategy} setups. This is your edge.`
          });
        }
        
        const worstStrategy = validStrategies[validStrategies.length - 1];
        if (worstStrategy.winRate < 35 || worstStrategy.avgPnL < -100) {
          insights.push({
            id: `strategy_bleeding_${worstStrategy.strategy}`,
            category: 'Strategy Edge',
            type: 'warning',
            priority: 'medium',
            title: `${worstStrategy.strategy.charAt(0).toUpperCase() + worstStrategy.strategy.slice(1)} Bleeding`,
            message: `${worstStrategy.strategy} strategy: ${worstStrategy.winRate.toFixed(0)}% win rate, $${worstStrategy.avgPnL.toFixed(0)} average.`,
            impact: `-$${Math.abs(worstStrategy.totalPnL).toFixed(0)}`,
            affectedTrades: worstStrategy.trades,
            confidence: 88,
            action: `Stop trading ${worstStrategy.strategy} until you fix the approach.`
          });
        }
      }
    }

    // 4. ⚖️ PROFIT MANAGEMENT (if enabled)
    if (insightSettings.profit_management) {
      const winners = allTrades.filter(t => t.outcome === 'win' && t.pnl > 0);
      const losers = allTrades.filter(t => t.outcome === 'loss' && t.pnl < 0);
      
      if (winners.length >= 4 && losers.length >= 4) {
        const avgWin = winners.reduce((sum, t) => sum + t.pnl, 0) / winners.length;
        const avgLoss = Math.abs(losers.reduce((sum, t) => sum + t.pnl, 0) / losers.length);
        const winLossRatio = avgWin / avgLoss;
        
        if (avgLoss > avgWin * 1.8) {
          insights.push({
            id: 'profit_management_bleeding',
            category: 'Profit Management',
            type: 'warning',
            priority: 'high',
            title: 'Classic "Cut Winners, Run Losers"',
            message: `Average loss ($${avgLoss.toFixed(0)}) is ${(avgLoss/avgWin).toFixed(1)}x your average win ($${avgWin.toFixed(0)}).`,
            impact: `-$${((avgLoss - avgWin) * Math.min(winners.length, losers.length)).toFixed(0)}`,
            affectedTrades: [...winners, ...losers],
            confidence: 95,
            action: 'Use hard stops. Let winners run to targets. Cut losers fast.'
          });
        } else if (winLossRatio >= 2.5) {
          insights.push({
            id: 'profit_management_mastery',
            category: 'Profit Management',
            type: 'success',
            priority: 'medium',
            title: 'Excellent Profit Management',
            message: `Average win ($${avgWin.toFixed(0)}) is ${winLossRatio.toFixed(1)}x average loss ($${avgLoss.toFixed(0)}).`,
            impact: `+$${((avgWin - avgLoss) * Math.min(winners.length, losers.length)).toFixed(0)}`,
            affectedTrades: winners,
            confidence: 88,
            action: 'Keep doing exactly what you\'re doing with profit management.'
          });
        }
      }
    }

    // 5. ⏰ TIMING EDGE (if enabled)
    if (insightSettings.timing_edge) {
      const timeGroups = {
        morning: allTrades.filter(t => {
          const hour = new Date(t.timestamp).getHours();
          return hour >= 9 && hour < 11;
        }),
        midday: allTrades.filter(t => {
          const hour = new Date(t.timestamp).getHours();
          return hour >= 11 && hour < 14;
        }),
        afternoon: allTrades.filter(t => {
          const hour = new Date(t.timestamp).getHours();
          return hour >= 14 && hour <= 16;
        })
      };

      let bestSession = null;
      let bestSessionPerf = -Infinity;

      Object.entries(timeGroups).forEach(([session, trades]) => {
        if (trades.length >= 4) {
          const avgPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length;
          if (avgPnL > bestSessionPerf) {
            bestSessionPerf = avgPnL;
            bestSession = { 
              name: session, 
              trades, 
              avgPnL,
              winRate: (trades.filter(t => t.outcome === 'win').length / trades.length) * 100
            };
          }
        }
      });

      if (bestSession && bestSession.avgPnL > 100 && bestSession.winRate >= 60) {
        insights.push({
          id: 'time_session_advantage',
          category: 'Timing Edge',
          type: 'success',
          priority: 'medium',
          title: `${bestSession.name.charAt(0).toUpperCase() + bestSession.name.slice(1)} Session Dominance`,
          message: `${bestSession.name} trading: ${bestSession.winRate.toFixed(0)}% win rate, $${bestSession.avgPnL.toFixed(0)} average.`,
          impact: `+$${(bestSession.avgPnL * bestSession.trades.length).toFixed(0)}`,
          affectedTrades: bestSession.trades,
          confidence: 85,
          action: `Focus 70% of your trading during ${bestSession.name} hours.`
        });
      }
    }

    // 6. 😡 REVENGE TRADING (if enabled)
    if (insightSettings.revenge_trading) {
      const revengeTrades = allTrades.filter(t => t.afterLoss === true || (!t.planned && t.quantity > 150));
      if (revengeTrades.length >= 3) {
        const revengeWinRate = (revengeTrades.filter(t => t.outcome === 'win').length / revengeTrades.length) * 100;
        const revengePnL = revengeTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
        
        if (revengeWinRate < 45 && revengePnL < -200) {
          insights.push({
            id: 'revenge_trading_bleeding',
            category: 'Emotional Control',
            type: 'warning',
            priority: 'high',
            title: 'Revenge Trading Detected',
            message: `${revengeTrades.length} revenge trades (emotional + oversized) show ${revengeWinRate.toFixed(0)}% win rate.`,
            impact: `-$${Math.abs(revengePnL).toFixed(0)}`,
            affectedTrades: revengeTrades,
            confidence: 92,
            action: 'Take 30-minute break after any loss. No exceptions.'
          });
        }
      }
    }

    // Sort by priority
    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const typeOrder = { warning: 3, success: 2, info: 1 };
      
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return typeOrder[b.type] - typeOrder[a.type];
    });
  }, [allTrades, insightSettings]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xmlContent = e.target.result;
          console.log('Uploaded XML:', xmlContent);
          setShowUploader(false);
        } catch (error) {
          console.error('Error parsing XML:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleInsight = (key) => {
    setInsightSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const insightOptions = [
    { key: 'planning_analysis', label: 'Planning vs Instinct Analysis', description: 'Compare planned vs spontaneous trades' },
    { key: 'size_discipline', label: 'Position Size Analysis', description: 'Find your optimal position sizing' },
    { key: 'strategy_performance', label: 'Strategy Performance', description: 'Best and worst performing strategies' },
    { key: 'profit_management', label: 'Profit Management', description: 'Winner vs loser ratio analysis' },
    { key: 'timing_edge', label: 'Timing Edge Analysis', description: 'Best performing time sessions' },
    { key: 'revenge_trading', label: 'Emotional Trading Detection', description: 'Detect revenge and emotional trades' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Intelligence Engine</h1>
              <p className="text-gray-600">
                Smart insights • {Object.values(insightSettings).filter(Boolean).length}/6 active
                {useDummyData && <span className="text-orange-600"> • Demo Mode</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Analysis ({allTrades.length} trades)</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Data</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Intelligence Settings</h3>
            <button onClick={() => setShowSettings(false)}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          
          {/* Demo Mode Toggle */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-orange-900">Demo Mode</h4>
                <p className="text-sm text-orange-700">Use sample data to test all insights</p>
              </div>
              <button
                onClick={() => setUseDummyData(!useDummyData)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useDummyData ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useDummyData ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Insight Controls */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Active Insights</h4>
            {insightOptions.map(option => (
              <div key={option.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${insightSettings[option.key] ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {insightSettings[option.key] ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{option.label}</h5>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleInsight(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    insightSettings[option.key] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    insightSettings[option.key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Trading Data</h3>
              <button onClick={() => setShowUploader(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Upload your trading platform export</p>
              <input
                type="file"
                accept=".xml,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Choose File
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {insights.filter(i => i.type === 'success').length}
              </p>
              <p className="text-gray-600">Strengths</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {insights.filter(i => i.priority === 'high').length}
              </p>
              <p className="text-gray-600">High Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Insights */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            className={`bg-white rounded-lg shadow-sm p-6 border-l-4 cursor-pointer transition-all hover:shadow-md ${
              insight.type === 'success' ? 'border-green-500' :
              insight.type === 'warning' ? 'border-red-500' :
              'border-blue-500'
            } ${selectedInsight?.id === insight.id ? 'ring-2 ring-purple-500' : ''}`}
            onClick={() => setSelectedInsight(insight)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  insight.type === 'success' ? 'bg-green-100' :
                  insight.type === 'warning' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {insight.type === 'success' ? (
                    <Award className="h-5 w-5 text-green-600" />
                  ) : insight.type === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Brain className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    insight.type === 'success' ? 'text-green-800' :
                    insight.type === 'warning' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-500">{insight.category}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {insight.priority === 'high' && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                    HIGH PRIORITY
                  </span>
                )}
                {insight.impact !== 'building' && insight.impact !== 'consistency' && (
                  <span className={`text-lg font-bold ${
                    insight.impact.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {insight.impact}
                  </span>
                )}
                {insight.confidence > 0 && (
                  <span className="text-xs text-gray-500">
                    {insight.confidence}% confidence
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              {insight.message}
            </p>
            
            {insight.action && (
              <div className={`p-3 rounded-lg border ${
                insight.type === 'success' ? 'bg-green-50 border-green-200' :
                insight.type === 'warning' ? 'bg-red-50 border-red-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <Zap className={`h-4 w-4 ${
                    insight.type === 'success' ? 'text-green-600' :
                    insight.type === 'warning' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    insight.type === 'success' ? 'text-green-800' :
                    insight.type === 'warning' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    Action: {insight.action}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                {insight.affectedTrades && insight.affectedTrades.length > 0 && (
                  <span>{insight.affectedTrades.length} trades analyzed</span>
                )}
              </div>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Insight Detail Panel */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedInsight.title}</h3>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {selectedInsight.category}
                    </span>
                    {selectedInsight.priority === 'high' && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        High Priority
                      </span>
                    )}
                    {selectedInsight.confidence > 0 && (
                      <span className="text-sm text-gray-500">
                        {selectedInsight.confidence}% confidence
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedInsight(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-3">Detailed Analysis</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">{selectedInsight.message}</p>
                  
                  {selectedInsight.action && (
                    <div className={`border rounded-lg p-4 mb-4 ${
                      selectedInsight.type === 'success' ? 'bg-green-50 border-green-200' :
                      selectedInsight.type === 'warning' ? 'bg-red-50 border-red-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <h5 className={`font-semibold mb-2 ${
                        selectedInsight.type === 'success' ? 'text-green-900' :
                        selectedInsight.type === 'warning' ? 'text-red-900' :
                        'text-blue-900'
                      }`}>
                        Recommended Action
                      </h5>
                      <p className={
                        selectedInsight.type === 'success' ? 'text-green-800' :
                        selectedInsight.type === 'warning' ? 'text-red-800' :
                        'text-blue-800'
                      }>
                        {selectedInsight.action}
                      </p>
                    </div>
                  )}
                  
                  {selectedInsight.affectedTrades && selectedInsight.affectedTrades.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-3">Affected Trades ({selectedInsight.affectedTrades.length})</h5>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {selectedInsight.affectedTrades.slice(0, 12).map(trade => (
                            <div key={trade.id} className="flex justify-between">
                              <span className="font-medium">{trade.ticker}</span>
                              <span className={trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                              </span>
                            </div>
                          ))}
                        </div>
                        {selectedInsight.affectedTrades.length > 12 && (
                          <div className="text-center mt-2 text-gray-500 text-sm">
                            +{selectedInsight.affectedTrades.length - 12} more trades
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold mb-3">Insight Metrics</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{selectedInsight.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`font-medium capitalize ${
                          selectedInsight.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {selectedInsight.priority}
                        </span>
                      </div>
                      {selectedInsight.confidence > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium">{selectedInsight.confidence}%</span>
                        </div>
                      )}
                      {selectedInsight.impact !== 'building' && selectedInsight.impact !== 'consistency' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Impact:</span>
                          <span className={`font-medium ${
                            selectedInsight.impact.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedInsight.impact}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedInsight.type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' :
                    selectedInsight.type === 'warning' ? 'bg-red-600 hover:bg-red-700 text-white' :
                    'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}>
                    Apply Insight
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {insights.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No Active Insights</p>
          <p className="text-sm">Enable insights in Settings or add more trading data</p>
        </div>
      )}
    </div>
  );
};

export { InsightDetector as Intelligence };xl font-bold text-gray-900">{insights.length}</p>
              <p className="text-gray-600">Active Insights</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-600">
                {insights.filter(i => i.type === 'warning').length}
              </p>
              <p className="text-gray-600">Issues Found</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2
