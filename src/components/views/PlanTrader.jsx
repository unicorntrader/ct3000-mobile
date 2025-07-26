import { useState, useMemo } from 'react';
import { sampleData } from '../data/sampleData';
import { calculateRiskReward } from '../utils/calculations';

export const useTradingState = () => {
  // ALL state in one place
  const [activeModule, setActiveModule] = useState('dashboard');
  const [expandedDays, setExpandedDays] = useState({});
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [notePopup, setNotePopup] = useState({ isOpen: false, date: '', note: '' });
  const [showNotePreviews, setShowNotePreviews] = useState(false);
  
  const [tradePlans, setTradePlans] = useState(sampleData.tradePlans);
  const [trades, setTrades] = useState(sampleData.trades);
  const [notes, setNotes] = useState(sampleData.notes);
  const [activities, setActivities] = useState(sampleData.activities);
  const [newPlan, setNewPlan] = useState({
    ticker: '',
    entry: '',
    target: '',
    stopLoss: '',
    position: 'long',
    quantity: '',
    notes: ''
  });

  // Calculate risk/reward for new plan
  const riskReward = useMemo(() => {
    if (!newPlan.entry || !newPlan.target || !newPlan.stopLoss) {
      return { risk: '0.00', reward: '0.00', ratio: '0.0' };
    }
    return calculateRiskReward(newPlan.entry, newPlan.target, newPlan.stopLoss, newPlan.position);
  }, [newPlan.entry, newPlan.target, newPlan.stopLoss, newPlan.position]);

  // Form validation
  const isFormValid = () => {
    return newPlan.ticker && 
           newPlan.entry && 
           newPlan.target && 
           newPlan.stopLoss && 
           newPlan.quantity &&
           parseFloat(newPlan.entry) > 0 &&
           parseFloat(newPlan.target) > 0 &&
           parseFloat(newPlan.stopLoss) > 0 &&
           parseFloat(newPlan.quantity) > 0;
  };

  // Plan analysis
  const getPlanAnalysis = () => {
    const ratio = parseFloat(riskReward.ratio);
    
    if (ratio >= 3) {
      return { 
        status: 'excellent', 
        message: 'Excellent risk/reward ratio!', 
        color: 'green' 
      };
    } else if (ratio >= 2) {
      return { 
        status: 'good', 
        message: 'Good risk/reward ratio', 
        color: 'blue' 
      };
    } else if (ratio >= 1.5) {
      return { 
        status: 'acceptable', 
        message: 'Acceptable risk/reward', 
        color: 'yellow' 
      };
    } else {
      return { 
        status: 'poor', 
        message: 'Poor risk/reward ratio', 
        color: 'red' 
      };
    }
  };

  // ALL business logic in one place
  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
  };

  const handleActivityClick = (activity) => {
    setActiveModule(activity.targetModule);
    
    if (activity.targetId) {
      setHighlightedItem(activity.targetId);
    }
    
    setTimeout(() => {
      setHighlightedItem(null);
    }, 2000);
  };

  const handlePlanClick = (planId) => {
    setActiveModule('plan-trader');
    setHighlightedItem(planId);
    setTimeout(() => {
      setHighlightedItem(null);
    }, 2000);
  };

  const addTradePlan = () => {
    if (isFormValid()) {
      const plan = {
        id: Date.now(),
        ...newPlan,
        timestamp: new Date().toISOString(),
        status: 'planned'
      };
      setTradePlans([...tradePlans, plan]);
      setNewPlan({
        ticker: '',
        entry: '',
        target: '',
        stopLoss: '',
        position: 'long',
        quantity: '',
        notes: ''
      });
    }
  };

  const deleteTradePlan = (id) => {
    setTradePlans(tradePlans.filter(plan => plan.id !== id));
  };

  const executeTradePlan = (planId) => {
    const plan = tradePlans.find(p => p.id === planId);
    if (plan) {
      const trade = {
        id: Date.now(),
        ...plan,
        executeTime: new Date().toISOString(),
        status: 'executed',
        pnl: Math.random() > 0.5 ? Math.random() * 500 : -Math.random() * 200,
        outcome: Math.random() > 0.5 ? 'win' : 'loss',
        exitPrice: parseFloat(plan.target) + (Math.random() - 0.5) * 10
      };
      setTrades([...trades, trade]);
      setTradePlans(tradePlans.map(p => 
        p.id === planId ? { ...p, status: 'executed' } : p
      ));
    }
  };

  const openNotePopup = (date) => {
    setNotePopup({
      isOpen: true,
      date: date,
      note: notes[date] || ''
    });
  };

  const closeNotePopup = () => {
    setNotePopup({ isOpen: false, date: '', note: '' });
  };

  const saveNoteFromPopup = () => {
    setNotes({ ...notes, [notePopup.date]: notePopup.note });
    closeNotePopup();
  };

  const updateDailyNote = (date, note) => {
    setNotes({ ...notes, [date]: note });
  };

  // Computed values (derived state)
  const computedData = {
    totalPnL: trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0),
    activePlans: tradePlans.filter(p => p.status === 'planned'),
    todayTrades: trades.filter(t => t.timestamp && t.timestamp.startsWith(new Date().toISOString().split('T')[0])),
    winRate: trades.length > 0 ? ((trades.filter(t => t.outcome === 'win').length / trades.length) * 100).toFixed(1) : 0,
    recentActivities: activities.slice(0, 6),
    recentPlans: tradePlans.slice(-5)
  };

  // Return EVERYTHING the UI needs
  return {
    // State
    activeModule,
    expandedDays,
    highlightedItem,
    notePopup,
    showNotePreviews,
    tradePlans,
    trades,
    notes,
    activities,
    newPlan,
    
    // Setters
    setActiveModule,
    setExpandedDays,
    setHighlightedItem,
    setNotePopup,
    setShowNotePreviews,
    setTradePlans,
    setTrades,
    setNotes,
    setActivities,
    setNewPlan,
    
    // Actions
    handleModuleChange,
    handleActivityClick,
    handlePlanClick,
    addTradePlan,
    deleteTradePlan,
    executeTradePlan,
    openNotePopup,
    closeNotePopup,
    saveNoteFromPopup,
    updateDailyNote,
    
    // PlanTrader specific
    riskReward,
    isFormValid,
    getPlanAnalysis,
    
    // Computed data
    ...computedData
  };
};
