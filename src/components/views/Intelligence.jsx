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
