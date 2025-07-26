import React from 'react';
import { Plus, Trash2, Play, Target } from 'lucide-react';
import { calculateRiskReward } from '../../utils/calculations';

export const PlanTrader = (props) => {
  const { 
    tradePlans, 
    newPlan, 
    setNewPlan, 
    addTradePlan, 
    deleteTradePlan, 
    executeTradePlan
  } = props;

  const [showForm, setShowForm] = React.useState(false);

  // Calculate risk/reward for current plan
  const riskReward = React.useMemo(() => {
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

  const analysis = getPlanAnalysis();

  // Check if mobile (simple detection)
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        {/* Mobile Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Trade Plans</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-4">New Trade Plan</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Ticker (AAPL)"
                value={newPlan.ticker}
                onChange={(e) => setNewPlan({...newPlan, ticker: e.target.value.toUpperCase()})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newPlan.position}
                  onChange={(e) => setNewPlan({...newPlan, position: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
                <input
                  type="number"
                  placeholder="Entry Price"
                  value={newPlan.entry}
                  onChange={(e) => setNewPlan({...newPlan, entry: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Target Price"
                  value={newPlan.target}
                  onChange={(e) => setNewPlan({...newPlan, target: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Stop Loss"
                  value={newPlan.stopLoss}
