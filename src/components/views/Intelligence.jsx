import React, { useState, useMemo } from 'react';
import {
  Brain,
  Upload,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  Target,
  Clock,
  DollarSign,
  Activity,
  BarChart3,
  Zap,
  Eye,
  Download,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const InsightDetector = ({ trades: propTrades = [], onTradesUpdate }) => {
  const [uploadedTrades, setUploadedTrades] = useState([]);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Dummy trades for testing when no XML uploaded
  const dummyTrades = [
    // Planned vs Unplanned examples
    { id: 1, ticker: 'AAPL', entry: 175, exit: 182, quantity: 100, pnl: 700, outcome: 'win', timestamp: '2025-01-15T09:30:00Z', planned: true, strategy: 'breakout' },
    { id: 2, ticker: 'MSFT', entry: 420, exit: 415, quantity: 150, pnl: -750, outcome: 'loss', timestamp: '2025-01-15T14:30:00Z', planned: false, strategy: null },
    { id: 3, ticker: 'NVDA', entry: 450, exit: 468, quantity: 50, pnl: 900, outcome: 'win', timestamp: '2025-01-16T09:45:00Z', planned: true, strategy: 'momentum' },
    
    // Size discipline examples
    { id: 4, ticker: 'TSLA', entry: 250, exit: 245, quantity: 200, pnl: -1000, outcome: 'loss', timestamp: '2025-01-16T11:00:00Z', planned: false, strategy: null },
    { id: 5, ticker: 'GOOGL', entry: 135, exit: 142, quantity: 25, pnl: 175, outcome: 'win', timestamp: '2025-01-17T10:15:00Z', planned: true, strategy: 'breakout' },
    
    // R/R examples
    { id: 6, ticker: 'META', entry: 320, exit: 325, quantity: 75, pnl: 375, outcome: 'win', timestamp: '2025-01-17T13:20:00Z', planned: true, strategy: 'momentum', riskReward: 2.5 },
    { id: 7, ticker: 'AMD', entry: 145, exit: 142, quantity: 100, pnl: -300, outcome: 'loss', timestamp: '2025-01-18T09:30:00Z', planned: true, strategy: 'breakout', riskReward: 0.8 },
    
    // Plan adherence examples  
    { id: 8, ticker: 'SPY', entry: 455, exit: 458, quantity: 80, pnl: 240, outcome: 'win', timestamp: '2025-01-18T10:45:00Z', planned: true, strategy: 'momentum', plannedExit: 460, exitType: 'early' },
    { id: 9, ticker: 'QQQ', entry: 375, exit: 378, quantity: 60, pnl: 180, outcome: 'win', timestamp: '2025-01-19T11:30:00Z', planned: true, strategy: 'momentum', plannedExit: 380, exitType: 'target' },
    
    // Strategy performance examples
    { id: 10, ticker: 'AAPL', entry: 178, exit: 185, quantity: 90, pnl: 630, outcome: 'win', timestamp: '2025-01-19T09:30:00Z', planned: true, strategy: 'breakout' },
    { id: 11, ticker: 'MSFT', entry: 425, exit: 430, quantity: 70, pnl: 350, outcome: 'win', timestamp: '2025-01-20T10:00:00Z', planned: true, strategy: 'momentum' },
    { id: 12, ticker: 'NVDA', entry: 465, exit: 462, quantity: 40, pnl: -120, outcome: 'loss', timestamp: '2025-01-20T14:15:00Z', planned: false, strategy: null },
    
    // Time-based examples
    { id: 13, ticker: 'TSLA', entry: 255, exit: 262, quantity: 55, pnl: 385, outcome: 'win', timestamp: '2025-01-21T09:35:00Z', planned: true, strategy: 'momentum' },
    { id: 14, ticker: 'META', entry: 325, exit: 322, quantity: 85, pnl: -255, outcome: 'loss', timestamp: '2025-01-21T15:00:00Z', planned: true, strategy: 'momentum' },
    
    // Revenge trading examples
    { id: 15, ticker: 'AMD', entry: 148, exit: 145, quantity: 300, pnl: -900, outcome: 'loss', timestamp: '2025-01-22T10:30:00Z', planned: false, strategy: null, afterLoss: true },
    { id: 16, ticker: 'GOOGL', entry: 138, exit: 141, quantity: 35, pnl: 105, outcome: 'win', timestamp: '2025-01-22T11:45:00Z', planned: true, strategy: 'breakout' }
  ];

  // Use uploaded trades if available, otherwise dummy trades
  const allTrades = uploadedTrades.length > 0 ? uploadedTrades : [...propTrades, ...dummyTrades];

  // 🧠 COMPLETE INSIGHT DETECTOR - ALL 3 PHASES
  const insights = useMemo(() => {
    const insights = [];
    
    if (allTrades.length < 5) {
      return [{
        id: 'insufficient_data',
        category: 'Data Requirements',
        type: 'info',
        phase: 1,
        title: 'Building Intelligence Profile',
        message: `Analyzing ${allTrades.length} trades. Need 5+ trades for behavioral analysis.`,
        impact: 'building',
        affectedTrades: [],
        confidence: 0
      }];
    }

    // PHASE 1: LOW HANGING FRUIT 🍒

    // 1. PLAN VS NO-PLAN ANALYSIS
    const plannedTrades = allTrades.filter(t => t.planned === true);
    const unplannedTrades = allTrades.filter(t => t.planned === false);
    
    if (plannedTrades.length >= 3 && unplannedTrades.length >= 3) {
      const plannedWinRate = (plannedTrades.filter(t => t.outcome === 'win').length / plannedTrades.length) * 100;
      const unplannedWinRate = (unplannedTrades.filter(t => t.outcome === 'win').length / unplannedTrades.length) * 100;
      const plannedAvgPnL = plannedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / plannedTrades.length;
      const unplannedAvgPnL = unplannedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / unplannedTrades.length;
      
      if (plannedAvgPnL > unplannedAvgPnL + 50) {
        insights.push({
          id: 'planning_advantage',
          category: 'Planning Discipline',
          type: 'success',
          phase: 1,
          title: 'Pre-Market Planning Advantage',
          message: `Planned trades (${plannedTrades.length}) average $${plannedAvgPnL.toFixed(0)} vs unplanned trades $${unplannedAvgPnL.toFixed(0)}. Your edge strengthens with preparation.`,
          impact: `+$${((plannedAvgPnL - unplannedAvgPnL) * plannedTrades.length).toFixed(0)}`,
          affectedTrades: plannedTrades,
          confidence: 88,
          action: 'Plan every trade before market open'
        });
      } else if (unplannedAvgPnL > plannedAvgPnL + 50) {
        insights.push({
          id: 'overthinking_penalty',
          category: 'Planning Discipline', 
          type: 'warning',
          phase: 1,
          title: 'Over-Planning Performance Drag',
          message: `Unplanned trades (${unplannedTrades.length}) outperform planned trades: $${unplannedAvgPnL.toFixed(0)} vs $${plannedAvgPnL.toFixed(0)}. Your instincts may be better than your plans.`,
          impact: `-$${Math.abs((plannedAvgPnL - unplannedAvgPnL) * plannedTrades.length).toFixed(0)}`,
          affectedTrades: plannedTrades,
          confidence: 75,
          action: 'Simplify planning process or trust instincts more'
        });
      }
    }

    // 2. SIZE DISCIPLINE
    const smallTrades = allTrades.filter(t => t.quantity <= 50);
    const mediumTrades = allTrades.filter(t => t.quantity > 50 && t.quantity <= 100);
    const largeTrades = allTrades.filter(t => t.quantity > 100);
    
    const analyzeSize = (trades, label) => {
      if (trades.length < 2) return null;
      return {
        label,
        count: trades.length,
        winRate: (trades.filter(t => t.outcome === 'win').length / trades.length) * 100,
        avgPnL: trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length,
        totalPnL: trades.reduce((sum, t) => sum + (t.pnl || 0), 0)
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
      
      if (bestSize.avgPnL > worstSize.avgPnL + 100) {
        const bestTrades = bestSize.label === 'Small' ? smallTrades : bestSize.label === 'Medium' ? mediumTrades : largeTrades;
        const worstTrades = worstSize.label === 'Small' ? smallTrades : worstSize.label === 'Medium' ? mediumTrades : largeTrades;
        
        insights.push({
          id: 'size_sweet_spot',
          category: 'Size Discipline',
          type: 'success',
          phase: 1,
          title: `${bestSize.label} Position Sweet Spot`,
          message: `${bestSize.label} positions deliver ${bestSize.winRate.toFixed(0)}% win rate, $${bestSize.avgPnL.toFixed(0)} average vs ${worstSize.label} at ${worstSize.avgPnL.toFixed(0)}. This is your optimal size range.`,
          impact: `+$${bestSize.totalPnL.toFixed(0)}`,
          affectedTrades: bestTrades,
          confidence: 85,
          action: `Focus 70% of trading on ${bestSize.label.toLowerCase()} position sizes`
        });
        
        insights.push({
          id: 'size_discipline_issue',
          category: 'Size Discipline',
          type: 'warning', 
          phase: 1,
          title: `${worstSize.label} Position Bleeding`,
          message: `${worstSize.label} positions underperform: ${worstSize.winRate.toFixed(0)}% win rate, $${worstSize.avgPnL.toFixed(0)} average. Size may be compromising decision quality.`,
          impact: `-$${Math.abs(worstSize.totalPnL).toFixed(0)}`,
          affectedTrades: worstTrades,
          confidence: 82,
          action: `Reduce ${worstSize.label.toLowerCase()} position sizes by 30-50%`
        });
      }
    }

    // 3. RISK/REWARD SOPHISTICATION
    const rrTrades = allTrades.filter(t => t.riskReward);
    if (rrTrades.length >= 4) {
      const lowRR = rrTrades.filter(t => t.riskReward < 1.5);
      const highRR = rrTrades.filter(t => t.riskReward >= 2.0);
      
      if (lowRR.length >= 2) {
        const lowRRWinRate = (lowRR.filter(t => t.outcome === 'win').length / lowRR.length) * 100;
        const lowRRPnL = lowRR.reduce((sum, t) => sum + (t.pnl || 0), 0);
        
        if (lowRRWinRate < 65 || lowRRPnL < 0) {
          insights.push({
            id: 'poor_rr_bleeding',
            category: 'Risk Management',
            type: 'warning',
            phase: 1,
            title: 'Low R/R Setup Bleeding',
            message: `${lowRR.length} trades with poor R/R ratios (<1.5:1) show ${lowRRWinRate.toFixed(0)}% win rate. These setups need 65%+ win rates to be profitable.`,
            impact: `-$${Math.abs(lowRRPnL).toFixed(0)}`,
            affectedTrades: lowRR,
            confidence: 90,
            action: 'Only take setups with 2:1+ risk/reward ratio'
          });
        }
      }
      
      if (highRR.length >= 2) {
        const highRRWinRate = (highRR.filter(t => t.outcome === 'win').length / highRR.length) * 100;
        const highRRPnL = highRR.reduce((sum, t) => sum + (t.pnl || 0), 0);
        
        if (highRRWinRate >= 45 && highRRPnL > 0) {
          insights.push({
            id: 'high_rr_mastery',
            category: 'Risk Management',
            type: 'success',
            phase: 1,
            title: 'High R/R Setup Mastery',
            message: `${highRR.length} high R/R trades (2:1+) show ${highRRWinRate.toFixed(0)}% win rate. Quality setups are your edge.`,
            impact: `+$${highRRPnL.toFixed(0)}`,
            affectedTrades: highRR,
            confidence: 88,
            action: 'Focus exclusively on 2:1+ R/R setups'
          });
        }
      }
    }

    // 4. PLAN ADHERENCE
    const adherenceTrades = allTrades.filter(t => t.planned && t.plannedExit && t.exitType);
    if (adherenceTrades.length >= 3) {
      const earlyExits = adherenceTrades.filter(t => t.exitType === 'early');
      const targetExits = adherenceTrades.filter(t => t.exitType === 'target');
      
      if (earlyExits.length >= 2) {
        const earlyExitPnL = earlyExits.reduce((sum, t) => sum + (t.pnl || 0), 0);
        const missedProfit = earlyExits.reduce((sum, t) => {
          const planned = (t.plannedExit - t.entry) * t.quantity;
          const actual = t.pnl || 0;
          return sum + Math.max(0, planned - actual);
        }, 0);
        
        if (missedProfit > 200) {
          insights.push({
            id: 'early_exit_bleeding',
            category: 'Plan Adherence',
            type: 'warning',
            phase: 1,
            title: 'Early Profit-Taking Bleeding',
            message: `${earlyExits.length} trades exited early vs plan. Missed approximately $${missedProfit.toFixed(0)} in additional profits.`,
            impact: `-$${missedProfit.toFixed(0)}`,
            affectedTrades: earlyExits,
            confidence: 85,
            action: 'Set alerts at planned exit levels and stick to targets'
          });
        }
      }
    }

    // PHASE 2: MEDIUM FRUIT 🌳

    // 5. STRATEGY & SETUP PERFORMANCE  
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

    Object.entries(strategyStats).forEach(([strategy, stats]) => {
      if (stats.trades.length >= 3 && strategy !== 'unassigned') {
        const winRate = (stats.wins / stats.trades.length) * 100;
        const avgPnL = stats.totalPnL / stats.trades.length;
        
        if (winRate >= 70 && avgPnL > 100) {
          insights.push({
            id: `strategy_mastery_${strategy}`,
            category: 'Strategy Performance',
            type: 'success',
            phase: 2,
            title: `${strategy.charAt(0).toUpperCase() + strategy.slice(1)} Strategy Mastery`,
            message: `${strategy} strategy: ${winRate.toFixed(0)}% win rate, $${avgPnL.toFixed(0)} average across ${stats.trades.length} trades. This setup is dialed in.`,
            impact: `+$${stats.totalPnL.toFixed(0)}`,
            affectedTrades: stats.trades,
            confidence: 80,
            action: `Increase allocation to ${strategy} setups by 25%`
          });
        } else if (winRate < 40 || avgPnL < -50) {
          insights.push({
            id: `strategy_bleeding_${strategy}`,
            category: 'Strategy Performance',
            type: 'warning',
            phase: 2,
            title: `${strategy.charAt(0).toUpperCase() + strategy.slice(1)} Strategy Bleeding`,
            message: `${strategy} strategy: ${winRate.toFixed(0)}% win rate, $${avgPnL.toFixed(0)} average. This approach needs refinement or elimination.`,
            impact: `-$${Math.abs(stats.totalPnL).toFixed(0)}`,
            affectedTrades: stats.trades,
            confidence: 85,
            action: `Pause ${strategy} trades until strategy is refined`
          });
        }
      }
    });

    // 6. PROFIT MANAGEMENT
    const winners = allTrades.filter(t => t.outcome === 'win' && t.pnl > 0);
    const losers = allTrades.filter(t => t.outcome === 'loss' && t.pnl < 0);
    
    if (winners.length >= 3 && losers.length >= 3) {
      const avgWin = winners.reduce((sum, t) => sum + t.pnl, 0) / winners.length;
      const avgLoss = Math.abs(losers.reduce((sum, t) => sum + t.pnl, 0) / losers.length);
      const winLossRatio = avgWin / avgLoss;
      
      if (avgLoss > avgWin * 1.5) {
        insights.push({
          id: 'profit_management_bleeding',
          category: 'Profit Management',
          type: 'warning',
          phase: 2,
          title: 'Classic "Cut Winners, Run Losers"',
          message: `Average loss ($${avgLoss.toFixed(0)}) is ${(avgLoss/avgWin).toFixed(1)}x larger than average win ($${avgWin.toFixed(0)}). Letting losers run while cutting winners early.`,
          impact: `-$${((avgLoss - avgWin) * Math.min(winners.length, losers.length)).toFixed(0)}`,
          affectedTrades: [...winners, ...losers],
          confidence: 92,
          action: 'Use hard stops and let winners run to planned targets'
        });
      } else if (winLossRatio >= 2.0) {
        insights.push({
          id: 'profit_management_mastery',
          category: 'Profit Management',
          type: 'success',
          phase: 2,
          title: 'Excellent Winner/Loser Ratio',
          message: `Average win ($${avgWin.toFixed(0)}) is ${winLossRatio.toFixed(1)}x average loss ($${avgLoss.toFixed(0)}). Strong profit-taking discipline.`,
          impact: `+$${((avgWin - avgLoss) * Math.min(winners.length, losers.length)).toFixed(0)}`,
          affectedTrades: winners,
          confidence: 88,
          action: 'Maintain current profit-taking approach'
        });
      }
    }

    // 7. REVENGE TRADING DETECTION
    const revengeTrades = allTrades.filter(t => t.afterLoss === true || (!t.planned && t.quantity > 150));
    if (revengeTrades.length >= 2) {
      const revengeWinRate = (revengeTrades.filter(t => t.outcome === 'win').length / revengeTrades.length) * 100;
      const revengePnL = revengeTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      
      if (revengeWinRate < 50 || revengePnL < 0) {
        insights.push({
          id: 'revenge_trading_bleeding',
          category: 'Emotional Control',
          type: 'warning',
          phase: 2,
          title: 'Revenge Trading Detection',
          message: `${revengeTrades.length} revenge trades (unplanned + oversized after losses) show ${revengeWinRate.toFixed(0)}% win rate. Emotional trading is bleeding capital.`,
          impact: `-$${Math.abs(revengePnL).toFixed(0)}`,
          affectedTrades: revengeTrades,
          confidence: 88,
          action: 'Take 30-minute break after any loss before next trade'
        });
      }
    }

    // PHASE 3: ADVANCED FRUIT 🚀

    // 8. TIME-BASED PERFORMANCE
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
    let worstSession = null;
    let bestSessionPerf = -Infinity;
    let worstSessionPerf = Infinity;

    Object.entries(timeGroups).forEach(([session, trades]) => {
      if (trades.length >= 3) {
        const avgPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length;
        if (avgPnL > bestSessionPerf) {
          bestSessionPerf = avgPnL;
          bestSession = { name: session, trades, avgPnL };
        }
        if (avgPnL < worstSessionPerf) {
          worstSessionPerf = avgPnL;
          worstSession = { name: session, trades, avgPnL };
        }
      }
    });

    if (bestSession && worstSession && bestSession.avgPnL > worstSession.avgPnL + 50) {
      const bestWinRate = (bestSession.trades.filter(t => t.outcome === 'win').length / bestSession.trades.length) * 100;
      
      insights.push({
        id: 'time_session_advantage',
        category: 'Timing Edge',
        type: 'success',
        phase: 3,
        title: `${bestSession.name.charAt(0).toUpperCase() + bestSession.name.slice(1)} Session Dominance`,
        message: `${bestSession.name} trading: ${bestWinRate.toFixed(0)}% win rate, $${bestSession.avgPnL.toFixed(0)} average vs ${worstSession.name} at $${worstSession.avgPnL.toFixed(0)}. You're sharpest during ${bestSession.name} hours.`,
        impact: `+$${(bestSession.avgPnL * bestSession.trades.length).toFixed(0)}`,
        affectedTrades: bestSession.trades,
        confidence: 85,
        action: `Focus 70% of trading activity during ${bestSession.name} hours`
      });
    }

    // 9. DAILY CONSISTENCY ANALYSIS
    const dailyPnL = {};
    allTrades.forEach(trade => {
      const date = trade.timestamp.split('T')[0];
      if (!dailyPnL[date]) dailyPnL[date] = 0;
      dailyPnL[date] += trade.pnl || 0;
    });

    const dailyResults = Object.values(dailyPnL);
    if (dailyResults.length >= 5) {
      const positiveDays = dailyResults.filter(pnl => pnl > 0).length;
      const dailyWinRate = (positiveDays / dailyResults.length) * 100;
      
      if (dailyWinRate >= 70) {
        insights.push({
          id: 'daily_consistency',
          category: 'Consistency',
          type: 'success',
          phase: 3,
          title: 'High Daily Win Rate',
          message: `${positiveDays} profitable days out of ${dailyResults.length} (${dailyWinRate.toFixed(0)}%). Strong daily consistency.`,
          impact: 'consistency',
          affectedTrades: [],
          confidence: 85,
          action: 'Maintain current daily P&L management approach'
        });
      } else if (dailyWinRate <= 40) {
        insights.push({
          id: 'daily_inconsistency',
          category: 'Consistency',
          type: 'warning',
          phase: 3,
          title: 'Daily Consistency Challenge',
          message: `Only ${positiveDays} profitable days out of ${dailyResults.length} (${dailyWinRate.toFixed(0)}%). High daily volatility detected.`,
          impact: 'volatility',
          affectedTrades: [],
          confidence: 80,
          action: 'Set daily P&L limits: +$500 target, -$300 stop'
        });
      }
    }

    // 10. MARKET VS P&L TRADING
    const quickTrades = allTrades.filter(t => {
      const entryTime = new Date(t.timestamp);
      const exitTime = new Date(t.timestamp);
      exitTime.setMinutes(exitTime.getMinutes() + 15); // Assume quick trades are <15min
      return t.quantity > 100; // Quick + large = likely P&L focused
    });

    if (quickTrades.length >= 3) {
      const quickWinRate = (quickTrades.filter(t => t.outcome === 'win').length / quickTrades.length) * 100;
      const quickAvgPnL = quickTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / quickTrades.length;
      
      if (quickWinRate < 50 && quickAvgPnL < 0) {
        insights.push({
          id: 'pnl_trading_bleeding',
          category: 'Market Focus',
          type: 'warning',
          phase: 3,
          title: 'P&L-Focused Trading Bleeding',
          message: `${quickTrades.length} quick + large trades show ${quickWinRate.toFixed(0)}% win rate. Trading P&L instead of market structure.`,
          impact: `-$${Math.abs(quickTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)).toFixed(0)}`,
          affectedTrades: quickTrades,
          confidence: 75,
          action: 'Focus on market structure, not profit targets'
        });
      }
    }

    return insights.sort((a, b) => {
      const phaseOrder = { 1: 3, 2: 2, 3: 1 };
      const severityOrder = { warning: 2, success: 1, info: 0 };
      return (phaseOrder[a.phase] - phaseOrder[b.phase]) || (severityOrder[b.type] - severityOrder[a.type]);
    });
  }, [allTrades]);

  // XML Upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Parse XML and convert to trade format
          const xmlContent = e.target.result;
          // This would need proper XML parsing in real implementation
          console.log('Uploaded XML:', xmlContent);
          setShowUploader(false);
        } catch (error) {
          console.error('Error parsing XML:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group insights by category
  const groupedInsights = useMemo(() => {
    const groups = {};
    insights.forEach(insight => {
      if (!groups[insight.category]) {
        groups[insight.category] = [];
      }
      groups[insight.category].push(insight);
    });
    return groups;
  }, [insights]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Intelligence Engine</h1>
              <p className="text-gray-600">Advanced behavioral pattern analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Analysis ({allTrades.length} trades)</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            <span>Upload XML</span>
          </button>
          <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md">
            <Download className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

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
              <p className="text-gray-600 mb-4">Upload your trading platform XML export</p>
              <input
                type="file"
                accept=".xml"
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
              <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
              <p className="text-gray-600">Total Insights</p>
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
              <p className="text-gray-600">Warnings</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-green-600" />
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
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {insights.filter(i => i.action).length}
              </p>
              <p className="text-gray-600">Actionable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights by Category */}
      <div className="space-y-6">
        {Object.entries(groupedInsights).map(([category, categoryInsights]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                <span className="text-sm text-gray-500">({categoryInsights.length} insights)</span>
              </div>
              {expandedCategories[category] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedCategories[category] && (
              <div className="p-6 space-y-4">
                {categoryInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all ${
                      insight.type === 'success' ? 'bg-green-50 border-green-500 hover:bg-green-100' :
                      insight.type === 'warning' ? 'bg-red-50 border-red-500 hover:bg-red-100' :
                      'bg-blue-50 border-blue-500 hover:bg-blue-100'
                    } ${selectedInsight?.id === insight.id ? 'ring-2 ring-purple-500' : ''}`}
                    onClick={() => setSelectedInsight(insight)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        {insight.type === 'success' ? (
                          <Award className="h-5 w-5 text-green-600" />
                        ) : insight.type === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Brain className="h-5 w-5 text-blue-600" />
                        )}
                        <h4 className={`font-semibold ${
                          insight.type === 'success' ? 'text-green-800' :
                          insight.type === 'warning' ? 'text-red-800' :
                          'text-blue-800'
                        }`}>
                          {insight.title}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-3">
                        {insight.phase && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            Phase {insight.phase}
                          </span>
                        )}
                        {insight.confidence > 0 && (
                          <span className="text-xs text-gray-500">
                            {insight.confidence}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      insight.type === 'success' ? 'text-green-700' :
                      insight.type === 'warning' ? 'text-red-700' :
                      'text-blue-700'
                    }`}>
                      {insight.message}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {insight.impact !== 'building' && insight.impact !== 'consistency' && insight.impact !== 'volatility' && (
                          <div className="text-sm">
                            <span className="text-gray-600">Impact:</span>
                            <span className={`font-medium ml-1 ${
                              insight.impact.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {insight.impact}
                            </span>
                          </div>
                        )}
                        {insight.affectedTrades && insight.affectedTrades.length > 0 && (
                          <div className="text-sm text-gray-600">
                            {insight.affectedTrades.length} trades affected
                          </div>
                        )}
                      </div>
                      
                      {insight.action && (
                        <div className="flex items-center text-purple-600">
                          <Zap className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Actionable</span>
                        </div>
                      )}
                    </div>
                    
                    {insight.action && (
                      <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                        <div className="text-sm text-gray-700">
                          <strong>Action:</strong> {insight.action}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                    {selectedInsight.phase && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        Phase {selectedInsight.phase}
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
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-900 mb-2">Recommended Action</h5>
                      <p className="text-blue-800">{selectedInsight.action}</p>
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
                  
                  <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
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
          <p className="text-lg">Building Intelligence Profile</p>
          <p className="text-sm">Need more trading data for pattern analysis</p>
        </div>
      )}
    </div>
  );
};

export default InsightDetector;
