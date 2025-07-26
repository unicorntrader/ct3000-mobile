import { useState } from 'react';
import { sampleData } from '../data/sampleData';

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
    if (newPlan.ticker && newPlan.entry && newPlan.target && newPlan.stopLoss) {
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
    
    // Computed data
    ...computedData
  };
};
